'use strict';

class Calculator {

  constructor() {
    this.mathSymbols = {
      'π': Math.PI
    };

    this.operatorDefinitions = {
      '^': {
        isPrimal: true,
        calculus:(a, b) => Math.pow(a, b)
      },
      '*': {
        isPrimal: true,
        calculus:(a, b) => a * b
      },
      '/': {
        isPrimal: true,
        calculus:(a, b) => {
          if (b === 0) {
            throw Infinity;
          }
          return a / b;
        }
      },
      '-': {
        isPrimal: false,
        calculus:(a, b) => a - b
      },
      '+': {
        isPrimal: false,
        calculus:(a, b) => a + b
      }
    };
  }

  sum(numbers) {
    return numbers.split(',')
      .map(a => parseFloat(a) || 0)
      .reduce((acc, val) => acc + val);
  }

  calculate() {
    const argsArr = Array.from(arguments);
    let numbersAndOperators = this._breakDownToNumbersAndOperators(argsArr);
    numbersAndOperators = this._replaceMathSymbols(numbersAndOperators);

    try {
      return this._doCalculate(this._calculatePrimalOperations(numbersAndOperators));
    } catch (err) {
      return err;
    }
  }

  _breakDownToNumbersAndOperators(array) {
    return this._flattenArray(array.map(a => a.split(/(\d+)/).filter(e => e)));
  }

  _flattenArray(array) {
    return [].concat.apply([], array);
  }

  _replaceMathSymbols(array) {
    return array.map(a => this.mathSymbols[a] || a);
  }

  _doCalculate(array) {
    return array.reduce(this._doOperation.bind(this), parseFloat(array[0]));
  }

  _calculatePrimalOperations(ops) {
    for(let i = 0; i < ops.length; i++) {
      const operator = ops[i];
      if (!this._isOperator(operator)) {
        continue;
      }
      if (!this.operatorDefinitions[operator].isPrimal) {
        continue;
      }

      const previousOperand = ops[i-1];
      const nextOperand = ops[i+1];

      ops[i-1] = this._doCalculate([previousOperand, operator, nextOperand]);
      ops.splice(i, 2);
    }

    return ops;
  }

  _doOperation(acc, val, index, originalArray) {
    if(this._isOperator(val)) {
      const firstOperator = parseFloat(originalArray[index+1]);
      return this.operatorDefinitions[val].calculus(acc, firstOperator);
    }
    return acc;
  }

  _isOperator(val) {
    return this.operatorDefinitions[val];
  }

  static create() {
    return new Calculator();
  }
}

module.exports = Calculator;
