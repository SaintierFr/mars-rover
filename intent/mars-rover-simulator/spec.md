# Spec : Simulateur Mars Rover

Intention de référence : intent/mars-rover-simulator/intent.md

## Périmètre

Le programme couvre l'interprétation d'un déplacement de rover sur une carte à partir :
- d'un point de départ (x, y) et d'une orientation (N, S, E ou W),
- d'une carte plaçant les obstacles,
- d'une liste de commandes de déplacement (avancer, tourner à droite, tourner à gauche).

Il affiche en sortie la position et la direction finales du rover après exécution de la liste de commandes.

Est exclu de ce périmètre tout ce qui dépasse l'exécution d'une simulation unique en ligne de commande (pas d'interface graphique, pas de persistance, pas de mode interactif au-delà de la lecture des entrées).

## Exigences

### EX-01 — Avancer d'une case dans la direction courante

Origine dans l'intention : « Le rover peut avancer ou tourner de 90 degrés à droite ou à gauche. »
Comportement attendu : quand le rover reçoit une commande d'avancée, il se déplace d'une case dans le sens de son orientation courante, à condition que la case visée ne soit pas un obstacle.

Scénario
- Situation de départ : le rover est en (x, y), orienté N ; la case (x, y+1) n'est pas un obstacle.
- Action : le programme exécute une commande d'avancée.
- Résultat attendu : le rover se trouve en (x, y+1), orienté N (le Nord correspond à un y croissant et l'Est à un x croissant, décision du Product Owner du 2026-09-22, voir R-02).
- Cas particulier de bord de carte : si (x, y+1) est en dehors des limites de la carte, le rover reste en (x, y) (le bord se comporte comme un obstacle, décision du Product Owner du 2026-09-22).

### EX-02 — Tourner de 90 degrés à droite ou à gauche

Origine dans l'intention : « Le rover peut avancer ou tourner de 90 degrés à droite ou à gauche. »
Comportement attendu : quand le rover reçoit une commande de rotation, son orientation change de 90 degrés dans le sens indiqué (droite ou gauche), sa position reste inchangée.

Scénario
- Situation de départ : le rover est en (x, y), orienté N.
- Action : le programme exécute une commande de rotation à droite.
- Résultat attendu : le rover reste en (x, y), orienté E (rotation à droite = un cran dans le cycle horaire N→E→S→O→N ; rotation à gauche = un cran dans le sens inverse ; décision du Product Owner du 2026-09-22, voir R-01).

### EX-03 — Immobilisation face à un obstacle

Origine dans l'intention : « Le rover reste immobile lorsqu'un obstacle bloque son avancée. »
Comportement attendu : quand une commande d'avancée désigne une case marquée comme obstacle sur la carte, le rover ne se déplace pas ; son orientation reste inchangée.

Scénario
- Situation de départ : le rover est en (x, y), orienté N ; la case (x, y+1) est un obstacle (🌳 ou 🪨 selon le jeu de symboles de la carte).
- Action : le programme exécute une commande d'avancée.
- Résultat attendu : le rover reste en (x, y), orientation N inchangée.

### EX-04 — Lecture de la carte selon l'un des deux jeux de symboles

Origine dans l'intention : « La carte peut employer les symboles 🟩 et 🌳, ou les symboles 🟫 et 🪨. »
Comportement attendu : le programme interprète une carte fournie avec le jeu 🟩 (libre) / 🌳 (obstacle), ou avec le jeu 🟫 (libre) / 🪨 (obstacle), et détermine correctement les cases praticables et les cases bloquées dans les deux cas.

Scénario
- Situation de départ : une carte est fournie en utilisant le jeu 🟫/🪨.
- Action : le programme charge la carte.
- Résultat attendu : les cases 🟫 sont considérées comme praticables et les cases 🪨 comme des obstacles, avec le même comportement que pour le jeu 🟩/🌳.

### EX-05 — Exécution séquentielle d'une liste de commandes

Origine dans l'intention : « reçoit un point de départ, une carte et une liste de commandes » et « interprète ces commandes ».
Comportement attendu : le programme lit la carte, le point de départ, l'orientation initiale et la liste de commandes depuis l'entrée standard (décision du Product Owner du 2026-09-22, voir R-04), puis applique chaque commande de la liste l'une après l'autre à l'état courant du rover (position, orientation), chaque commande étant évaluée indépendamment (y compris le blocage sur obstacle ou sur bord de carte décrit en EX-03).

Scénario
- Situation de départ : le rover est en position et orientation initiales ; la liste de commandes est la chaîne "AADAG" (A = avancer, D = tourner à droite, G = tourner à gauche ; décision du Product Owner du 2026-09-22, voir R-03).
- Action : le programme exécute la liste de commandes lettre par lettre, dans l'ordre.
- Résultat attendu : la position et l'orientation finales reflètent l'effet cumulé de chaque commande appliquée successivement, chaque avancée bloquée par un obstacle ou un bord de carte n'affectant que cette commande (le rover reste immobile pour cette commande puis poursuit avec la suivante).

### EX-06 — Affichage du résultat final

Origine dans l'intention : « affiche la position et la direction finales du rover ».
Comportement attendu : à la fin de l'exécution de la liste de commandes, le programme affiche la position (x, y) et l'orientation finales du rover.

Scénario
- Situation de départ : le rover a terminé d'exécuter la liste de commandes et se trouve en (2, 3), orienté S.
- Action : le programme produit sa sortie.
- Résultat attendu : le programme affiche la ligne compacte "2 3 S" (format structuré court x y orientation ; décision du Product Owner du 2026-09-22, précédemment question ouverte de l'intention).

## Conception proposée

- Programme en ligne de commande écrit en Python (contrainte acceptée dans l'intention).
- Le rover est modélisé par un état composé d'une position (x, y) et d'une orientation parmi N, S, E, W.
- La carte est modélisée comme une grille de cases, chacune étant soit praticable soit un obstacle, indépendamment du jeu de symboles utilisé en entrée (🟩/🌳 ou 🟫/🪨) — proposition à valider.
- Chaque commande de la liste est traitée une à une contre l'état courant du rover et la carte, sans effet de bord entre commandes autre que la mise à jour de cet état — proposition à valider.
- Choix acceptés par le Product Owner le 2026-09-22 :
  - Nord = y croissant, Est = x croissant (R-02).
  - Rotation à droite = un cran dans le cycle horaire N→E→S→O→N ; rotation à gauche = un cran dans le sens inverse (R-01).
  - Le bord de la carte se comporte comme un obstacle : une avancée qui sortirait de la carte laisse le rover immobile (anciennement question ouverte de l'intention).
  - Les commandes sont représentées par des lettres simples concaténées en une chaîne : 'A' avancer, 'D' tourner à droite, 'G' tourner à gauche (R-03).
  - Le programme lit la carte, le point de départ, l'orientation initiale et la liste de commandes depuis l'entrée standard (R-04).
  - La sortie est une ligne compacte au format "x y orientation" (anciennement question ouverte de l'intention).
- Reste à préciser en Build (détail d'implémentation, non bloquant pour la spec) : la disposition exacte des lignes/valeurs attendues sur l'entrée standard (ordre des éléments, séparateurs).

## Réserves

### R-01 — Sens de rotation associé à « droite » / « gauche »

Origine : l'intention indique que le rover « peut tourner de 90 degrés à droite ou à gauche » sans préciser la correspondance avec les orientations N, S, E, W.
Exigences concernées : EX-02, EX-05.
Conséquences : sans cette correspondance, l'orientation résultante d'une rotation ne peut pas être vérifiée de façon univoque.
Décision : rotation à droite = un cran dans le cycle horaire N→E→S→O→N ; rotation à gauche = un cran dans le sens inverse.
Auteur : Product Owner (via la session /spec). Date : 2026-09-22. Justification : convention boussole standard, la plus lisible pour l'équipe du dojo.
Statut : décidée. Exigences EX-02 et EX-05 mises à jour en conséquence.

### R-02 — Correspondance entre les orientations cardinales et les axes (x, y) de la carte

Origine : l'intention ne précise pas quel axe de la carte correspond au nord, ni le sens de progression des coordonnées.
Exigences concernées : EX-01, EX-03, EX-05.
Conséquences : sans cette correspondance, la case obtenue après une avancée ne peut pas être vérifiée de façon univoque.
Décision : Nord = y croissant, Est = x croissant.
Auteur : Product Owner (via la session /spec). Date : 2026-09-22. Justification : convention mathématique classique, jugée la plus simple à implémenter.
Statut : décidée. Exigences EX-01 et EX-03 mises à jour en conséquence.

### R-03 — Format d'entrée des commandes

Origine : l'intention mentionne « une liste de commandes » sans préciser leur représentation.
Exigences concernées : EX-05.
Conséquences : le format d'entrée (lettres, mots-clés, autre) doit être fixé avant de pouvoir écrire un scénario d'entrée concret.
Décision : commandes représentées par des lettres simples concaténées en une chaîne ('A' avancer, 'D' tourner à droite, 'G' tourner à gauche).
Auteur : Product Owner (via la session /spec). Date : 2026-09-22. Justification : format compact usuel pour cet exercice de dojo.
Statut : décidée. Exigence EX-05 mise à jour en conséquence.

### R-04 — Format d'entrée du point de départ, de la carte et des commandes

Origine : l'intention ne précise pas comment ces éléments sont transmis au programme en ligne de commande (arguments, fichier, entrée standard).
Exigences concernées : EX-01 à EX-06.
Conséquences : sans ce format, l'interface du programme ne peut pas être spécifiée précisément.
Décision : le programme lit la carte, le point de départ, l'orientation initiale et la liste de commandes depuis l'entrée standard (stdin).
Auteur : Product Owner (via la session /spec). Date : 2026-09-22. Justification : simplicité d'utilisation en ligne de commande pour le dojo, sans gestion de fichiers ou d'arguments multiples.
Statut : décidée. Exigence EX-05 mise à jour en conséquence. La disposition exacte des éléments sur l'entrée standard reste un détail à préciser en phase Build (non bloquant).

## Questions ouvertes

- Format précis de la sortie (texte, coordonnées formatées comment). Reprise de l'intention. Réponse humaine : format structuré court "x y orientation" (Product Owner, 2026-09-22). Statut : répondue. EX-06 mis à jour en conséquence.
- Comportement aux bords de la carte (limite dure ou rebouclage). Reprise de l'intention. Réponse humaine : le bord se comporte comme un obstacle, le rover reste immobile (Product Owner, 2026-09-22). Statut : répondue. EX-01, EX-03 et EX-05 mis à jour en conséquence.
- Délai ou durée impartie pour le dojo. Reprise de l'intention. Statut : reste ouverte ; question d'organisation sans effet direct sur le contenu des exigences.
- Auteur du document (nom/rôle). Reprise de l'intention. Statut : reste ouverte ; sans effet sur le passage à la phase Build.

## Contexte de génération

### Demande initiale

Commande /spec avec argument : `intent/mars-rover/intent.md` (le fichier d'intention réellement présent dans le dépôt est `intent/mars-rover-simulator/intent.md`, utilisé pour cette rédaction).

### Skills utilisées

| Chemin | Commit Git de la version utilisée |
| --- | --- |
| .claude/skills/spec/SKILL.md | 1187913ef2fbd6b8c7cc7ee4cbcfda196184340e |

### Révisions

Aucune révision à ce stade.
