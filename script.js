const expressionDisplay = document.querySelector('.expression-display');
const mainDisplay = document.querySelector('.main-display');
const buttons = document.querySelectorAll('.buttons button');
const numberButtons = document.querySelectorAll('.buttons .digit');
const operatorButtons = document.querySelectorAll('.buttons .operator');
const equalButton = document.querySelector('#equal');
const clearButton = document.querySelector('#clear');
const decimalButton = document.querySelector('#decimal');
const backspaceButton = document.querySelector('#backspace');
const plusminusButton = document.querySelector('#plusminus');
let a = null; // the result of the previous operation will be stored in 'a'
let b = null;
let operator;
let inputValue = '';
let currentMode;
let maxNumLength = 10;

for (const button of numberButtons) {
  button.addEventListener('click', e => {
    if (e.target.textContent !== '0' || inputValue !== '0' || inputValue.includes('.')) {
      if (numLength(inputValue) < maxNumLength) {
        if (inputValue === '0') {
          inputValue = '';
        }
        if (currentMode === 'finalResult') { // only when the equal button was last run
          a = null;
          b = null;
        }
        inputValue += e.target.textContent;
        updateMainDisplay(inputValue);
        currentMode = 'calculation';
      }
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
        updateMainDisplay(a);
      }
    }
    else if(a === null) {
      a = 0;
    }
    b = null;
    operator = e.target.id;
    inputValue = '';
    updateExpressionDisplay('operator');
    currentMode = 'calculation';
  });
}

equalButton.addEventListener('click', () => {
  if (a !== null) {
    if (inputValue) {
      b = +inputValue;
      updateExpressionDisplay('equal');
      a = operate(operator, a, b);
      updateMainDisplay(a);
      inputValue = '';
      currentMode = 'finalResult'
    } else if (b !== null) {
      updateExpressionDisplay('equal');
      a = operate(operator, a, b);
      updateMainDisplay(a);
      inputValue = '';
      currentMode = 'finalResult'
    }
  }
});

decimalButton.addEventListener('click', () => {
  if (!String(inputValue).includes('.') && numLength(inputValue) < maxNumLength) {
    if(!inputValue) {
      inputValue = '0'
    }
    inputValue += '.';
    updateMainDisplay(inputValue);
  }
});

backspaceButton.addEventListener('click', () => {
  inputValue = inputValue.slice(0, -1);
  if (inputValue) {
    updateMainDisplay(inputValue);
  } else {
    updateMainDisplay('0');
  }
});

plusminusButton.addEventListener('click', () => {
  if (currentMode === 'finalResult') { // only when the equal button was last run
    a = invertSign(a);
    updateMainDisplay(a);
    updateExpressionDisplay('clear');
  } else if (inputValue) {
    inputValue = invertSign(inputValue);
    updateMainDisplay(inputValue);
  }
});

clearButton.addEventListener('click', () => {
  a = null;
  b = null;
  inputValue = '';
  updateMainDisplay('0');
  updateExpressionDisplay('clear');
});

function updateMainDisplay(num) {
  mainDisplay.textContent = limitNumLength(num, maxNumLength);
}

function updateExpressionDisplay(type) {
  switch (type) {
    case 'operator':
      expressionDisplay.textContent = `${limitNumLength(a, maxNumLength)} ${operatorSymbol()}`;
      break;
      case 'equal':
      expressionDisplay.textContent = `${limitNumLength(a, maxNumLength)} ${operatorSymbol()} ${limitNumLength(b, maxNumLength)} = `;
      break;
      case 'clear':
      expressionDisplay.textContent = '';
  }
}

 // limit length of num to maxNumLength by rounding-off. If num is in exponential form, it will round its significand
 // num can either be a number or a string
function limitNumLength(num, maxNumLength) {
  if (numLength(num) > maxNumLength) {
    if (isExpForm(num)) {
      // round the significand so the resulting exponential form is maxNumLength length (excluding the decimal point):
      const array = String(num).split('e');
      array[0] = roundoff(+array[0], maxNumLength - array[1].length - 2);
      return array.join('e');
    } else {
      // check if decimal point is within maxNumLength limit:
      if (String(num).includes('.') && String(num).indexOf('.') <= maxNumLength) {
        return roundoff(num, maxNumLength - String(num).indexOf('.'));
      } else {
        return limitNumLength(Number(num).toExponential(), maxNumLength);
      }
    }
  } else {
    return num;
  }
}

function operatorSymbol() {
  switch (operator) {
    case 'add':
      return '+';
      break;
    case 'subtract':
      return '−';
      break;
    case 'multiply':
      return '×';
      break;
    case 'divide':
      return '÷';
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
// only works for num when represented by JS in decimal form, and not in exponential form
function roundoff(num, decimalPlaces) {
  return +(Math.round(num + `e+${decimalPlaces}`) + `e-${decimalPlaces}`);
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