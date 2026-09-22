import { parseFormInput, ParseInputError } from './parseFormInput.js';
import { simulate } from './simulate.js';
import { formatOutput } from './formatOutput.js';

const form = document.querySelector('#simulation-form');
const errorsElement = document.querySelector('#errors');
const resultElement = document.querySelector('#result');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  errorsElement.textContent = '';
  resultElement.textContent = '';

  const fields = {
    mapText: form.elements.map.value,
    x: form.elements.x.value,
    y: form.elements.y.value,
    orientation: form.elements.orientation.value,
    commands: form.elements.commands.value,
  };

  try {
    const { map, rover, commands } = parseFormInput(fields);
    const finalState = simulate(rover, map, commands);
    resultElement.textContent = formatOutput(finalState);
  } catch (error) {
    errorsElement.textContent =
      error instanceof ParseInputError ? error.errors.join(' ') : `Erreur : ${error.message}`;
  }
});
