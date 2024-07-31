import './style.css';

// Types
type Operations = 'add' | 'multiply' | 'divide' | 'subtract';
type Dataset = {
  firstValue?: string;
  operation?: Operations;
  secondValue?: string;
  previousKey?: string;
};

// Elements
const calculator = document.querySelector('.calculator') as HTMLElement;
const displayEl = document.querySelector('.calculator_display');
const clearButton = calculator.querySelector('[data-operation=clear]');

// States
let isCleared: boolean = true;
let operatorActive: boolean = false;
const calcUtils = ['equals', 'clear', 'decimal'];

const buttons = [
  ...calculator?.querySelectorAll('button'),
] as HTMLButtonElement[];

const applyActiveAction = (action: string) => {
  operatorActive = true;
  if (!calcUtils.includes(action)) {
    buttons.forEach((b) => {
      if (b.dataset.operation === action) {
        b.classList.add('active');
      }
    });
  }
};

const clearData = () => {
  delete calculator.dataset.operation;
  delete calculator.dataset.firstValue;
  delete calculator.dataset.secondValue;
  delete calculator.dataset.previousKey;
  isCleared = true;
};

const calculate = ({ ...dataset }: Dataset): void => {
  let result: string;
  if (dataset.operation === 'add') {
    result = (
      parseFloat(dataset.firstValue) + parseFloat(dataset.secondValue)
    ).toString();
  }
  if (dataset.operation === 'subtract') {
    result = (
      parseFloat(dataset.firstValue) - parseFloat(dataset.secondValue)
    ).toString();
  }
  if (dataset.operation === 'multiply') {
    result = (
      parseFloat(dataset.firstValue) * parseFloat(dataset.secondValue)
    ).toString();
  }
  if (dataset.operation === 'divide') {
    // Handle dividing zero / zero
    const checkResult =
      parseFloat(dataset.firstValue) / parseFloat(dataset.secondValue);
    if (checkResult) {
      result = checkResult.toString();
    }
  }
  displayEl.textContent = result || dataset.firstValue;
  // Use resulting value as first input
  clearData();
  calculator.dataset.firstValue = result || '0';
};

const handleOperation = (operation: string) => {
  if (operation === 'clear') {
    displayEl.textContent = '0';
    clearButton.textContent = 'AC';
    if (calculator.dataset.previousKey === 'clear') {
      clearData();
      return;
    }
    calculator.dataset.previousKey = 'clear';
    return;
  }

  if (operation === 'decimal') {
    operatorActive = false;
    clearButton.textContent = 'CE';
    // Only add if no decimals entered
    if (displayEl.textContent.indexOf('.') < 0) {
      displayEl.textContent = displayEl.textContent + '.';
    }
    return;
  }

  applyActiveAction(operation);

  // Log values in state
  // Has first two steps - add third
  if (calculator.dataset.firstValue && calculator.dataset.operation) {
    calculator.dataset.secondValue = displayEl.textContent;
  } else {
    // Has no steps - add first two
    calculator.dataset.firstValue = displayEl.textContent;
    calculator.dataset.operation = operation;
  }

  if (operation === 'equals') {
    if (!calculator.dataset.operation || !calculator.dataset.secondValue) {
      // Can't do a calculation
      displayEl.textContent = calculator.dataset.firstValue || '0';
      return;
    }
    calculate({ ...calculator.dataset });
  }
};

const handleNumber = (number: string) => {
  clearButton.textContent = 'CE';
  appendDisplayValue(number);
};

const appendDisplayValue = (newVal: string) => {
  if (
    (displayEl.textContent === '0' && newVal === '0' && !isCleared) ||
    (displayEl.textContent === '0' && isCleared) ||
    (operatorActive && newVal !== '.')
  ) {
    displayEl.textContent = newVal;
  } else {
    displayEl.textContent = displayEl.textContent += newVal;
  }
  operatorActive = false;
  isCleared = false;
};

const removeHeldKeys = () => {
  buttons.forEach((b) => b.classList.remove('active'));
};

buttons?.forEach((b) => {
  b.addEventListener('click', (e) => {
    e.preventDefault();
    const key = e.target as HTMLButtonElement;
    const { operation } = key.dataset;
    removeHeldKeys();
    if (operation) {
      handleOperation(operation);
    } else {
      handleNumber(key.textContent);
    }
  });
});
