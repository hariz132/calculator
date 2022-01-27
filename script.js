const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.buttons button');
const numberButtons = document.querySelectorAll('.buttons .digit');
const operatorButtons = document.querySelectorAll('.buttons .operator');
const equalButton = document.querySelector('#equal');
const clearButton = document.querySelector('#clear');
const decimalButton = document.querySelector('#decimal');
const backspaceButton = document.querySelector('#backspace');
const plusminusButton = document.querySelector('#plusminus');
let a = null; // a is the result of the previous operation
let b = null;
let operator;
let inputValue = '';
let currentMode;
let maxDisplayChar = 10;

for (const button of numberButtons) {
  button.addEventListener('click', e => {
    if (numLength(inputValue) < maxDisplayChar) {
      inputValue += e.target.textContent;
      updateDisplay(inputValue);
      if (currentMode === 'finalResult') { // only when the equal button was last run
        a = null;
        b = null;
      }
      currentMode = 'calculation';
    }
  });
}

for (const button of operatorButtons) {
  button.addEventListener('click', e => {
    if (inputValue) {
      if (a === null) {
        a = +inputValue;
      } else {
        b = +inputValue;
        a = operate(operator, a, b);
        updateDisplay(a);
      }
    }
    b = null;
    operator = e.target.id;
    inputValue = '';
    currentMode = 'calculation';
  });
}

equalButton.addEventListener('click', () => {
  if (a !== null) {
    if (inputValue) {
      b = +inputValue;
      a = operate(operator, a, b);
      updateDisplay(a);
      inputValue = '';
      currentMode = 'finalResult'
    } else if (b !== null) {
      a = operate(operator, a, b);
      updateDisplay(a);
      inputValue = '';
      currentMode = 'finalResult'
    }
  }
});

decimalButton.addEventListener('click', () => {
  if (!String(inputValue).includes('.') && numLength(inputValue) < maxDisplayChar) {
    inputValue += '.';
    updateDisplay(inputValue);
  }
});

backspaceButton.addEventListener('click', () => {
  inputValue = inputValue.slice(0, -1);
  if (inputValue) {
    updateDisplay(inputValue);
  } else {
    updateDisplay('0');
  }
});

plusminusButton.addEventListener('click', () => {
  if (currentMode === 'finalResult') { // only when the equal button was last run
    a = invertSign(a);
    updateDisplay(a);
  } else if (inputValue) {
    inputValue = invertSign(inputValue);
    updateDisplay(inputValue);
  }
});

clearButton.addEventListener('click', () => {
  a = null;
  b = null;
  inputValue = '';
  updateDisplay('0');
});

function updateDisplay(num) { // can accept either number or string arguments
  if (numLength(num) > maxDisplayChar) {
    if (isExpForm(num)) {
      // round the significand so the resulting exponential form is maxDisplayChar length (excluding the decimal point)
      const array = String(num).split('e');
      array[0] = roundoff(+array[0], maxDisplayChar - array[1].length - 2);
      display.textContent = array.join('e');
    } else {
      // check if decimal point is within maxDisplayChar limit
      if (String(num).includes('.') && String(num).indexOf('.') <= maxDisplayChar) {
        display.textContent = roundoff(num, maxDisplayChar - String(num).indexOf('.'));
      } else {
        updateDisplay(Number(num).toExponential());
      }
    }
  } else {
    display.textContent = num;
  }
}

function invertSign(num) {
  switch (Math.sign(num)) {
    case 1:
      return num = '-' + num;
      break;
    case -1:
      return num = String(num).slice(1);
      break;
    default:
      return num;
  }
}

// rounds num to the specified decimal places
function roundoff(num, decimalPlaces) {
  return +(Math.round(num + `e+${decimalPlaces}`) + `e-${decimalPlaces}`);
  // only works for num when represented by JS in decimal form, and not in exponential form
}

// length of a number (excluding the decimal point). If num is in exp form, it also counts the exp parts
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