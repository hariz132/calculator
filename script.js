const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.buttons button');
const digitButtons = document.querySelectorAll('.buttons .digit');
const operatorButtons = document.querySelectorAll('.buttons .operator');
const equalButton = document.querySelector('#equal');
let displayValue = '';
let operator;
let savedValue;

for (const button of digitButtons) {
  button.addEventListener('click', e => {
    displayValue += e.target.textContent;
    updateDisplay(displayValue);
  });
}

for (const button of operatorButtons) {
  button.addEventListener('click', e => {
    if (savedValue) {
      displayValue = operate(operator, +savedValue, +displayValue);
      updateDisplay(displayValue);
    }
    operator = e.target.id;
    savedValue = displayValue;
    displayValue = '';
  });
}

equalButton.addEventListener('click', e => {
  if (savedValue) {
    displayValue = operate(operator, +savedValue, +displayValue);
    updateDisplay(displayValue);
  }
  savedValue = displayValue;
  displayValue = '';
});

function updateDisplay(str) {
  display.textContent = str;
}

function operate(operator, a, b) {
  switch (operator) {
    case 'add':
      return add(a, b);
    case 'subtract':
      return subtract(a, b);
    case 'multiply':
      return multiply(a, b);
    case 'divide':
      return divide(a, b);
  }
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}