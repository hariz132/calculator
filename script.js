const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.buttons button');
const digitButtons = document.querySelectorAll('.buttons .digit');
const operatorButtons = document.querySelectorAll('.buttons .operator');
const equalButton = document.querySelector('#equal');
const clearButton = document.querySelector('#clear');
let a = ''; // a is the result of the previous operation
let b = '';
let operator;
let inputValue = '';
let maxDisplayChar = 10;

for (const button of digitButtons) {
  button.addEventListener('click', e => {
    inputValue += e.target.textContent;
    updateDisplay(+inputValue);
  });
}

for (const button of operatorButtons) {
  button.addEventListener('click', e => {
    if (inputValue) {
      if (!a) {
        a = inputValue;
      } else {
        b = inputValue;
        a = operate(operator, +a, +b);
        updateDisplay(a);
      }
    }
    operator = e.target.id;
    inputValue = '';
  });
}

equalButton.addEventListener('click', () => {
  if (a) {
    if (inputValue) {
      b = inputValue;
      a = operate(operator, +a, +b);
      updateDisplay(a);
      inputValue = '';
    } else if (b) {
      a = operate(operator, +a, +b);
      updateDisplay(a);
      inputValue = '';
    }
  }
});

clearButton.addEventListener('click', () => {
  a = '';
  b = '';
  inputValue = '';
  display.textContent = '';
});

function updateDisplay(num) {
  if (numLength(num) > maxDisplayChar) {
    if (isExpForm(num)) {
      // round the significand so the resulting exponential is maxDisplayChar length (excluding the decimal place)
      const array = String(num).split('e');
      array[0] = roundoff(+array[0], maxDisplayChar - array[1].length - 2);
      display.textContent = array.join('e');
    } else {
      // check if decimal place is within maxDisplayChar limit
      if (String(num).includes('.') && String(num).indexOf('.') <= maxDisplayChar) {
        display.textContent = roundoff(num, maxDisplayChar - String(num).indexOf('.'));
      } else {
        updateDisplay(num.toExponential());
      }
    }
  } else {
    display.textContent = num;
  }
}

// rounds num to the specified decimal places
function roundoff(num, decimalPlaces) {
  return +(Math.round(num + `e+${decimalPlaces}`) + `e-${decimalPlaces}`); 
  // doesn't work when (num + `e+${decimalPlaces}`) doesn't evaluate to a decimal form ??
}

// length of a number (excluding the decimal place). If num is in exp form, it also counts the exp parts
function numLength(num) { 
  return String(num).replace('.', '').length;
}

function isExpForm(num) {
  return String(num).includes('e');
}

function decimalPlaces(num) {
  return String(num).includes('.') ? String(num).split('.')[1].length : 0;
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