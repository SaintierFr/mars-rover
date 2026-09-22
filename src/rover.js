// Cycle horaire des orientations (R-01) : Nord → Est → Sud → Ouest → Nord.
export const ORIENTATIONS = ['N', 'E', 'S', 'O'];

export function createRover(x, y, orientation) {
  return { x, y, orientation };
}

export function turnRight(rover) {
  const index = ORIENTATIONS.indexOf(rover.orientation);
  const nextIndex = (index + 1) % ORIENTATIONS.length;
  return { ...rover, orientation: ORIENTATIONS[nextIndex] };
}

export function turnLeft(rover) {
  const index = ORIENTATIONS.indexOf(rover.orientation);
  const nextIndex = (index - 1 + ORIENTATIONS.length) % ORIENTATIONS.length;
  return { ...rover, orientation: ORIENTATIONS[nextIndex] };
}
