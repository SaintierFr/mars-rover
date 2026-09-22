import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFormInput, ParseInputError } from '../src/parseFormInput.js';

const VALID_FIELDS = {
  mapText: '🟩🟩🟩\n🟩🌳🟩\n🟩🟩🟩',
  x: '1',
  y: '0',
  orientation: 'N',
  commands: 'AAD',
};

test('convertit des champs valides en carte, rover et commandes', () => {
  const { map, rover, commands } = parseFormInput(VALID_FIELDS);
  assert.equal(map.width, 3);
  assert.equal(map.height, 3);
  assert.deepEqual(rover, { x: 1, y: 0, orientation: 'N' });
  assert.equal(commands, 'AAD');
});

test('rejette une carte vide', () => {
  assert.throws(
    () => parseFormInput({ ...VALID_FIELDS, mapText: '' }),
    (error) => error instanceof ParseInputError && error.errors.some((m) => m.includes('carte')),
  );
});

test('rejette des coordonnées x/y non entières', () => {
  assert.throws(
    () => parseFormInput({ ...VALID_FIELDS, x: 'abc' }),
    (error) => error instanceof ParseInputError && error.errors.some((m) => m.includes('x')),
  );
  assert.throws(
    () => parseFormInput({ ...VALID_FIELDS, y: '' }),
    (error) => error instanceof ParseInputError && error.errors.some((m) => m.includes('y')),
  );
});

test('rejette une orientation invalide', () => {
  assert.throws(
    () => parseFormInput({ ...VALID_FIELDS, orientation: 'W' }),
    (error) => error instanceof ParseInputError && error.errors.some((m) => m.includes('Orientation')),
  );
});

test('rejette une liste de commandes vide ou avec des lettres inconnues', () => {
  assert.throws(
    () => parseFormInput({ ...VALID_FIELDS, commands: '' }),
    (error) => error instanceof ParseInputError && error.errors.some((m) => m.includes('commandes')),
  );
  assert.throws(
    () => parseFormInput({ ...VALID_FIELDS, commands: 'AAZ' }),
    (error) => error instanceof ParseInputError && error.errors.some((m) => m.includes('commandes')),
  );
});

test('accumule toutes les erreurs quand plusieurs champs sont invalides', () => {
  assert.throws(
    () => parseFormInput({ mapText: '', x: '', y: '', orientation: '', commands: '' }),
    (error) => error instanceof ParseInputError && error.errors.length === 5,
  );
});
