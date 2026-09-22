import { turnRight, turnLeft } from './rover.js';
import { isFree } from './map.js';

// Correspondance orientation → déplacement (R-02 : Nord = y croissant, Est = x croissant).
const DELTAS = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  O: { dx: -1, dy: 0 },
};

// EX-01 / EX-03 : avance d'une case dans l'orientation courante, sauf si la case visée est un
// obstacle ou hors carte (le bord se comporte comme un obstacle, cf. map.js), auquel cas le
// rover reste immobile.
function advance(rover, map) {
  const { dx, dy } = DELTAS[rover.orientation];
  const x = rover.x + dx;
  const y = rover.y + dy;
  if (!isFree(map, x, y)) return rover;
  return { ...rover, x, y };
}

export function applyCommand(rover, map, command) {
  switch (command) {
    case 'A':
      return advance(rover, map);
    case 'D':
      return turnRight(rover);
    case 'G':
      return turnLeft(rover);
    default:
      throw new Error(`Commande inconnue : "${command}"`);
  }
}

// EX-05 : applique chaque commande de la chaîne l'une après l'autre à l'état courant. Chaque
// commande est évaluée indépendamment : un blocage sur une commande n'affecte pas les
// suivantes.
export function simulate(rover, map, commands) {
  return Array.from(commands).reduce(
    (state, command) => applyCommand(state, map, command),
    rover,
  );
}
