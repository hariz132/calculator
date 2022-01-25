const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.buttons button');
const digitButtons = document.querySelectorAll('.buttons .digit');
const operatorButtons = document.querySelectorAll('.buttons .operator');
const equalButton = document.querySelector('#equal');
let a = ''; // a is the result of the previous operation
let b = '';
let operator;
let inputValue = '';

for (const button of digitButtons) {
  button.addEventListener('click', e => {
    inputValue += e.target.textContent;
    updateDisplay(inputValue);
  });
}

for (const button of operatorButtons) {
  button.addEventListener('click', e => {
    if (!a) { // the case only for the very first value inputted
      a = inputValue;
    } else if (inputValue) {
      b = inputValue;
      a = operate(operator, +a, +b);
      updateDisplay(a);
    }
    operator = e.target.id;
    inputValue = '';
  });
}

equalButton.addEventListener('click', () => {
  if (inputValue) {
    b = inputValue;
  }
  a = operate(operator, +a, +b);
  updateDisplay(a);
  inputValue = '';
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