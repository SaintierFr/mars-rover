// EX-04 : deux jeux de symboles possibles pour une carte, librement mélangeables en interne
// (une carte donnée n'utilise en pratique qu'un seul jeu, mais rien n'empêche de reconnaître
// les deux à la fois).
const FREE_SYMBOLS = new Set(['🟩', '🟫']);

// Convention retenue pour associer les lignes du texte de la carte à l'axe y (Nord = y
// croissant, R-02) : la première ligne du texte représente le Nord (y le plus grand), la
// dernière ligne représente y = 0 — comme une carte lue de haut en bas. Ce n'est pas fixé
// explicitement par la spec ; c'est un détail d'implémentation Build, documenté ici.
export function parseMap(text) {
  const rows = text
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => Array.from(line));
  const height = rows.length;
  const width = height > 0 ? rows[0].length : 0;
  return { rows, width, height };
}

export function isWithinBounds(map, x, y) {
  return x >= 0 && x < map.width && y >= 0 && y < map.height;
}

// Une case est praticable si elle est dans les limites de la carte ET marquée libre. Le bord
// de la carte se comporte ainsi comme un obstacle (EX-01, EX-03) sans traitement séparé.
export function isFree(map, x, y) {
  if (!isWithinBounds(map, x, y)) return false;
  const rowIndex = map.height - 1 - y;
  const symbol = map.rows[rowIndex]?.[x];
  return FREE_SYMBOLS.has(symbol);
}
