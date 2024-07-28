import './style.css';

// Types
type Operations = 'add' | 'multiply' | 'divide' | 'subtract';
type Dataset = {
  firstValue?: string;
  operation?: Operations;
  secondValue?: string;
};

// Elements
const calculator = document.querySelector('.calculator') as HTMLElement;
const displayEl = document.querySelector('.calculator_display');

// States
let isCleared: boolean = true;
let operatorActive: boolean = false;
const calcUtils = ['equals', 'clear'];

const buttons = [
  ...calculator?.querySelectorAll('button'),
] as HTMLButtonElement[];

const applyActiveAction = (action: string) => {
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
  clearData();

  // Use resulting value as first input
  calculator.dataset.firstValue = result || '0';
};

const handleOperation = (operation: string) => {
  applyActiveAction(operation);
  operatorActive = true;

  if (operation === 'clear') {
    displayEl.textContent = '0';
    isCleared = true;
    operatorActive = false;
    clearData();
    return;
  }

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
      return (displayEl.textContent = calculator.dataset.firstValue || '0');
    }
    calculate({ ...calculator.dataset });
  }
};

const handleNumber = (number: string) => {
  appendDisplayValue(number);
};

const appendDisplayValue = (newVal: string) => {
  if (
    (displayEl.textContent === '0' && newVal === '0' && !isCleared) ||
    (displayEl.textContent === '0' && isCleared) ||
    operatorActive
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
