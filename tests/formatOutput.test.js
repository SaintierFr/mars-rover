import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatOutput } from '../src/formatOutput.js';

test('formate l\'état final en ligne compacte "x y orientation" (EX-06)', () => {
  assert.equal(formatOutput({ x: 2, y: 3, orientation: 'S' }), '2 3 S');
});

test('gère les coordonnées à zéro et négatives', () => {
  assert.equal(formatOutput({ x: 0, y: 0, orientation: 'N' }), '0 0 N');
  assert.equal(formatOutput({ x: -1, y: 4, orientation: 'O' }), '-1 4 O');
});
