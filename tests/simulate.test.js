import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRover } from '../src/rover.js';
import { parseMap } from '../src/map.js';
import { simulate } from '../src/simulate.js';

const FREE_5X5 = parseMap(
  ['🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩'].join('\n'),
);

test('avance vers le Nord : y croissant (EX-01, R-02)', () => {
  const rover = createRover(2, 2, 'N');
  assert.deepEqual(simulate(rover, FREE_5X5, 'A'), { x: 2, y: 3, orientation: 'N' });
});

test('avance vers l\'Est : x croissant (EX-01, R-02)', () => {
  const rover = createRover(2, 2, 'E');
  assert.deepEqual(simulate(rover, FREE_5X5, 'A'), { x: 3, y: 2, orientation: 'E' });
});

test('avance vers le Sud : y décroissant (EX-01, R-02)', () => {
  const rover = createRover(2, 2, 'S');
  assert.deepEqual(simulate(rover, FREE_5X5, 'A'), { x: 2, y: 1, orientation: 'S' });
});

test('avance vers l\'Ouest : x décroissant (EX-01, R-02)', () => {
  const rover = createRover(2, 2, 'O');
  assert.deepEqual(simulate(rover, FREE_5X5, 'A'), { x: 1, y: 2, orientation: 'O' });
});

test('avance bloquée par un obstacle : rover immobile (EX-03)', () => {
  const map = parseMap(['🟩🟩🟩', '🟩🌳🟩', '🟩🟩🟩'].join('\n'));
  const rover = createRover(1, 0, 'N');
  assert.deepEqual(simulate(rover, map, 'A'), { x: 1, y: 0, orientation: 'N' });
});

test('avance bloquée par le bord de la carte : rover immobile (EX-01)', () => {
  const map = parseMap(['🟩🟩', '🟩🟩'].join('\n'));
  const rover = createRover(0, 0, 'O');
  assert.deepEqual(simulate(rover, map, 'A'), { x: 0, y: 0, orientation: 'O' });
});

test('un blocage n\'affecte pas les commandes suivantes (EX-05)', () => {
  // (1,1) N bloqué par l'obstacle en (1,2) ; D tourne ensuite vers l'Est ; A avance librement.
  const map = parseMap(['🟩🌳🟩', '🟩🟩🟩', '🟩🟩🟩'].join('\n'));
  const rover = createRover(1, 1, 'N');
  assert.deepEqual(simulate(rover, map, 'ADA'), { x: 2, y: 1, orientation: 'E' });
});

test('exécute une chaîne de commandes complète (scénario "AADAG" du spec, EX-05)', () => {
  const rover = createRover(2, 2, 'N');
  // A: (2,3) N — A: (2,4) N — D: (2,4) E — A: (3,4) E — G: (3,4) N
  assert.deepEqual(simulate(rover, FREE_5X5, 'AADAG'), { x: 3, y: 4, orientation: 'N' });
});

test('applyCommand rejette une commande inconnue', () => {
  const rover = createRover(0, 0, 'N');
  assert.throws(() => simulate(rover, FREE_5X5, 'X'));
});
