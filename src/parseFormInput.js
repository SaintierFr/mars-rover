import { createRover } from './rover.js';
import { parseMap } from './map.js';

const VALID_ORIENTATIONS = new Set(['N', 'E', 'S', 'O']);
const VALID_COMMANDS = /^[ADG]+$/;

export class ParseInputError extends Error {
  constructor(errors) {
    super(errors.join(' '));
    this.name = 'ParseInputError';
    this.errors = errors;
  }
}

function parseInteger(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

// Convertit les champs bruts du formulaire web (carte en zone de texte multi-lignes, x/y en
// champs numériques, orientation en liste déroulante N/E/S/O, commandes en champ texte) en
// entrées exploitables par simulate().
export function parseFormInput({ mapText, x, y, orientation, commands }) {
  const errors = [];

  if (typeof mapText !== 'string' || mapText.trim() === '') {
    errors.push('La carte est vide.');
  }

  const parsedX = parseInteger(x);
  if (parsedX === null) {
    errors.push('La coordonnée x doit être un nombre entier.');
  }

  const parsedY = parseInteger(y);
  if (parsedY === null) {
    errors.push('La coordonnée y doit être un nombre entier.');
  }

  if (!VALID_ORIENTATIONS.has(orientation)) {
    errors.push(`Orientation invalide : "${orientation}". Attendu N, E, S ou O.`);
  }

  const trimmedCommands = typeof commands === 'string' ? commands.trim() : '';
  if (trimmedCommands === '') {
    errors.push('La liste de commandes est vide.');
  } else if (!VALID_COMMANDS.test(trimmedCommands)) {
    errors.push('La liste de commandes ne doit contenir que les lettres A, D, G.');
  }

  if (errors.length > 0) {
    throw new ParseInputError(errors);
  }

  return {
    map: parseMap(mapText),
    rover: createRover(parsedX, parsedY, orientation),
    commands: trimmedCommands,
  };
}
