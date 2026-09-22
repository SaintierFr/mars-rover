# mars-rover
Dojo SDLC AI-native Agile en Seine

Simulateur de rover martien : une application web en JavaScript qui interprète une carte, un
point de départ et une liste de commandes, puis affiche la position et l'orientation finales du
rover. Voir `intent/mars-rover-simulator/intent.md`, `spec.md` et `plan.md` pour le contexte et
les décisions produit.

## Tests

```sh
npm test
```

Lance les tests unitaires (`node --test`, sans dépendance à installer).

## Lancer l'application

`index.html` charge la logique via des modules ES (`<script type="module">`), qu'un navigateur
comme Chrome refuse de charger en ouverture directe du fichier (`file://`). Il faut donc servir
le dossier en HTTP, par exemple :

```sh
npx serve .
# ou
python3 -m http.server
```

puis ouvrir la page servie dans un navigateur.
