# Intent : Simulateur Mars Rover
Auteur : non renseigné.

## Problème
Dans le cadre d'un coding dojo, l'équipe doit s'exercer à développer un simulateur de rover martien. Il n'existe pas encore de programme permettant d'interpréter des commandes de déplacement à partir d'un point de départ et d'une carte, puis d'en déduire la position et la direction finales du rover.

## Résultat proposé
Un programme en ligne de commande, écrit en Python, qui :
- reçoit un point de départ, une carte et une liste de commandes,
- interprète ces commandes,
- affiche la position et la direction finales du rover.

## Utilisateurs et systèmes concernés
- L'équipe participant au coding dojo, qui développe et utilise le programme.

## Contraintes
- Langage : Python.
- Le simulateur reçoit un point (x, y), une orientation N, S, E ou W, une carte plaçant les obstacles, et une liste de commandes.
- Le rover peut avancer ou tourner de 90 degrés à droite ou à gauche.
- Le rover reste immobile lorsqu'un obstacle bloque son avancée.
- La carte peut employer les symboles 🟩 et 🌳, ou les symboles 🟫 et 🪨.

## Questions ouvertes
- Format précis de la sortie (texte, coordonnées formatées comment).
- Comportement aux bords de la carte (limite dure ou rebouclage).
- Délai ou durée impartie pour le dojo.
- Auteur du document (nom/rôle).
