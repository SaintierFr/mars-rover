#!/usr/bin/env node
// Rejoue le scénario de démonstration "AADAG" du spec (EX-05) et affiche l'état final du rover.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFormInput } from '../src/parseFormInput.js';
import { simulate } from '../src/simulate.js';
import { formatOutput } from '../src/formatOutput.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const examplePath = join(__dirname, '..', 'examples', 'demo-scenario.json');

const DEFAULT_SCENARIO = {
  mapText: ['🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩', '🟩🟩🟩🟩🟩'].join('\n'),
  x: '2',
  y: '2',
  orientation: 'N',
  commands: 'AADAG',
};

if (!existsSync(examplePath)) {
  mkdirSync(dirname(examplePath), { recursive: true });
  writeFileSync(examplePath, `${JSON.stringify(DEFAULT_SCENARIO, null, 2)}\n`);
  console.log(`Fichier d'exemple créé : ${examplePath}`);
}

const scenario = JSON.parse(readFileSync(examplePath, 'utf8'));
const { map, rover, commands } = parseFormInput(scenario);
console.log(formatOutput(simulate(rover, map, commands)));
