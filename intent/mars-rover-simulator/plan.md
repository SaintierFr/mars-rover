# Plan de réalisation — Simulateur Mars Rover (Build)

## Contexte

`intent/mars-rover-simulator/intent.md` et `spec.md` se contredisent sur la stack cible :
intent.md a été modifié après coup (commit `7fe4e04`, « Bascule la stack technique vers une
webapp JavaScript ») pour remplacer « programme CLI en Python » par « application web en
JavaScript », mais `spec.md` (section Conception, réserve R-04) et `CLAUDE.md` décrivent
toujours un CLI Python lisant l'entrée sur stdin — ils n'ont pas été mis à jour après ce
changement. Décision du Product Owner (confirmée en session) : **suivre intent.md, donc
construire une application web en JavaScript**, pas un CLI Python.

Conséquence sur la spec : les exigences métier EX-01 à EX-06 et les réserves R-01/R-02/R-03
(sens de rotation, correspondance axes/orientations, format des commandes) restent valables
telles quelles car elles sont indépendantes de l'interface. En revanche, R-04 (lecture depuis
stdin) ne s'applique plus telle quelle à une webapp : les mêmes informations (carte, point de
départ, orientation, commandes) seront saisies via un formulaire HTML plutôt que via stdin.
C'est un point de détail d'implémentation, non bloquant pour démarrer le Build (au même titre
que la disposition exacte de stdin ne l'était pas pour le CLI) — mais il vaudra la peine, une
fois le Build lancé, de proposer une mise à jour de `spec.md` et de `CLAUDE.md` pour refléter la
stack JavaScript/webapp (à valider séparément, hors périmètre de ce plan).

Objectif de ce plan : poser une implémentation JavaScript simple (sans framework ni bundler,
adapté à un exercice de dojo), avec la logique métier testée indépendamment de l'interface web.

## Étape 0 — Enregistrer ce plan (première étape, isolée)

- Créer `intent/mars-rover-simulator/plan.md` avec le contenu de ce plan.
- Commit contenant **uniquement** ce fichier (`git add intent/mars-rover-simulator/plan.md`),
  message décrivant l'ajout du plan de Build. Pas de push ni de PR à ce stade (non demandé).

## Architecture proposée

JavaScript pur (ES modules), sans framework ni outil de build :
- Logique métier dans des modules purs, sans dépendance au DOM, testables directement avec le
  test runner intégré de Node (`node --test`) — aucune dépendance npm à installer.
- Une page HTML + un module d'interface qui relie le formulaire au moteur de simulation, pour
  respecter le « résultat proposé » de l'intent (page web affichant position/orientation
  finales).

## Fichiers à créer

Sous la racine du repo (le simulateur n'a pas encore de code) :

- `package.json` — `"type": "module"`, script `"test": "node --test"`.
- `src/rover.js` — état du rover `{x, y, orientation}` ; fonction de rotation (droite/gauche)
  appliquant le cycle N→E→S→O→N (R-01).
- `src/map.js` — modèle de grille : parse un texte de carte en cases praticables/obstacles,
  gère les deux jeux de symboles 🟩/🌳 et 🟫/🪨 (EX-04) ; fonction de test « case
  praticable » utilisée par la logique d'avancée.
- `src/simulate.js` — orchestrateur : à partir de l'état initial, de la carte et d'une chaîne
  de commandes (`A`/`D`/`G`), applique chaque commande séquentiellement (EX-05), gère
  l'avancée avec blocage sur obstacle ou bord de carte (EX-01, EX-03, correspondance d'axes
  R-02), et renvoie l'état final. Chaque commande est évaluée indépendamment (un blocage
  n'affecte pas les commandes suivantes).
- `src/formatOutput.js` — formate l'état final en ligne compacte `"x y orientation"` (EX-06).
- `src/parseFormInput.js` — convertit les valeurs du formulaire web (carte, point de départ,
  orientation, commandes) en objets exploitables par `simulate.js`. La disposition exacte des
  champs du formulaire est un détail d'implémentation (équivalent web du point R-04), fixé ici
  simplement : carte en zone de texte multi-lignes, x/y en champs numériques, orientation en
  liste déroulante N/S/E/O, commandes en champ texte.
- `index.html` — page avec le formulaire ci-dessus, une zone d'affichage du résultat, et le
  chargement du module d'interface.
- `src/ui.js` — écoute la soumission du formulaire, appelle `parseFormInput` puis `simulate`,
  affiche le résultat formaté (ou un message d'erreur si les entrées sont invalides).
- `tests/rover.test.js`, `tests/map.test.js`, `tests/simulate.test.js`,
  `tests/formatOutput.test.js` — tests unitaires Node (`node:assert/strict`).

## Ordre de travail

1. **Étape 0** ci-dessus (plan.md, commit isolé).
2. Scaffolding : `package.json`, arborescence `src/` et `tests/` vides.
3. `rover.js` + tests : rotation droite/gauche (EX-02, R-01), état initial.
4. `map.js` + tests : parsing des deux jeux de symboles (EX-04), détection obstacle/limite de
   carte.
5. `simulate.js` + tests : avancée avec correspondance d'axes (EX-01, R-02), blocage sur
   obstacle (EX-03), blocage sur bord de carte (EX-01), exécution séquentielle d'une chaîne de
   commandes avec indépendance de chaque commande (EX-05, scénario "AADAG" du spec).
6. `formatOutput.js` + tests : format `"x y orientation"` (EX-06).
7. `parseFormInput.js` + tests : conversion des champs du formulaire vers les entrées de
   `simulate.js`.
8. `index.html` + `src/ui.js` : intégration du formulaire au moteur ; vérification manuelle
   dans un navigateur (ouvrir `index.html`, exécuter un scénario, comparer au résultat attendu).
9. Relecture finale, mise à jour de `README.md` si utile, dernier commit.

Chaque étape 3 à 7 fait l'objet d'un commit séparé (code + tests correspondants), pour garder
un historique lisible et vérifiable à chaque étape.

## Tests prévus

Tests unitaires Node (`npm test` → `node --test`), un fichier par module, calqués sur les
scénarios de `spec.md` :
- Rotation à droite/gauche depuis chacune des 4 orientations (cycle complet N→E→S→O→N et
  inverse).
- Avancée dans chacune des 4 directions avec la correspondance d'axes R-02 (Nord = y croissant,
  Est = x croissant).
- Avancée bloquée par un obstacle (les deux jeux de symboles 🌳 et 🪨) : position et orientation
  inchangées.
- Avancée bloquée par un bord de carte : position et orientation inchangées.
- Parsing de carte avec le jeu 🟩/🌳 et avec le jeu 🟫/🪨 : mêmes résultats de praticabilité.
- Exécution d'une chaîne de commandes complète (ex. "AADAG" du spec) vérifiant l'effet cumulé,
  y compris un blocage intermédiaire qui n'affecte pas les commandes suivantes.
- Formatage de sortie `"x y orientation"` pour différents états.
- Conversion des champs de formulaire vers les entrées de simulation (cas valide ; au moins un
  cas d'entrée incomplète/invalide si `parseFormInput` doit signaler une erreur).

Vérification bout-en-bout : ouverture manuelle de `index.html` dans un navigateur, saisie d'un
scénario du spec (carte, point de départ, orientation, "AADAG"), contrôle que le résultat
affiché correspond à la sortie attendue.
