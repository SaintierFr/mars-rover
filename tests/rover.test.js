import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRover, turnRight, turnLeft, ORIENTATIONS } from '../src/rover.js';

test('createRover initialise la position et l\'orientation', () => {
  const rover = createRover(2, 3, 'N');
  assert.deepEqual(rover, { x: 2, y: 3, orientation: 'N' });
});

test('turnRight parcourt le cycle horaire N→E→S→O→N', () => {
  let rover = createRover(0, 0, 'N');
  for (const expected of [...ORIENTATIONS.slice(1), 'N']) {
    rover = turnRight(rover);
    assert.equal(rover.orientation, expected);
  }
});

test('turnLeft parcourt le cycle anti-horaire N→O→S→E→N', () => {
  let rover = createRover(0, 0, 'N');
  for (const expected of ['O', 'S', 'E', 'N']) {
    rover = turnLeft(rover);
    assert.equal(rover.orientation, expected);
  }
});

test('une rotation ne modifie pas la position (EX-02)', () => {
  const rover = createRover(2, 3, 'N');
  assert.deepEqual(turnRight(rover), { x: 2, y: 3, orientation: 'E' });
  assert.deepEqual(turnLeft(rover), { x: 2, y: 3, orientation: 'O' });
});
