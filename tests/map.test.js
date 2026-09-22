import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMap, isWithinBounds, isFree } from '../src/map.js';

test('parseMap calcule la largeur et la hauteur de la carte', () => {
  const map = parseMap('🟩🟩🟩\n🟩🌳🟩\n🟩🟩🟩');
  assert.equal(map.width, 3);
  assert.equal(map.height, 3);
});

test('isFree reconnaît le jeu de symboles 🟩 (libre) / 🌳 (obstacle) (EX-04)', () => {
  const map = parseMap('🟩🌳\n🟩🟩');
  assert.equal(isFree(map, 0, 0), true); // 🟩 en bas-gauche
  assert.equal(isFree(map, 1, 1), false); // 🌳 en haut-droite
});

test('isFree reconnaît le jeu de symboles 🟫 (libre) / 🪨 (obstacle) (EX-04)', () => {
  const map = parseMap('🟫🪨\n🟫🟫');
  assert.equal(isFree(map, 0, 0), true); // 🟫 en bas-gauche
  assert.equal(isFree(map, 1, 1), false); // 🪨 en haut-droite
});

test('la première ligne du texte correspond au Nord (y le plus grand)', () => {
  // Ligne du haut = obstacle en (0,1) ; ligne du bas = libre en (0,0).
  const map = parseMap('🌳🟩\n🟩🟩');
  assert.equal(isFree(map, 0, 1), false);
  assert.equal(isFree(map, 0, 0), true);
});

test('isWithinBounds et isFree renvoient false hors des limites de la carte', () => {
  const map = parseMap('🟩🟩\n🟩🟩');
  assert.equal(isWithinBounds(map, 2, 0), false);
  assert.equal(isWithinBounds(map, 0, -1), false);
  assert.equal(isFree(map, 2, 0), false);
  assert.equal(isFree(map, -1, 0), false);
});
