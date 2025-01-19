const inputExpression = document.getElementById("expression");
const inputNotation = document.getElementById("polish-notation");
const buttonCalculations = document.getElementById("calculations");
const resultElement = document.getElementById("result");
const errorElement = document.getElementById("error");

buttonCalculations.addEventListener("click", () => {
  cleanData();
  errorElement.textContent = "";

  const expression = inputExpression.value;

  if (validateExpression(expression)) {
    validateExpression(expression);
    parsExpression(expression);

    inputNotation.value = getReversePolishNsotation();
    resultElement.textContent = `Результат вычислений: ${getResultCalculation()}`;
  } else {
    errorElement.textContent = "Некорректное выражение";
  }
});

const validateExpression = (expression) =>
  /^[^a-zA-Zа-яА-ЯёЁ]*$/.test(expression);

const operatorStack = [];
let outputQueue = [];
let resultCalculation = null;

const operators = new Map();

operators.set("^", { precedence: 4 });
operators.set("+", { precedence: 2 });
operators.set("-", { precedence: 2 });
operators.set("/", { precedence: 3 });
operators.set("*", { precedence: 3 });
operators.set("(", { precedence: 1 });
operators.set(")", { precedence: 1 });

const operationCases = (operator, operand1, operand2) => {
  switch (operator) {
    case "^":
      return operand1 ** operand2;
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
  }
};

const parseOperator = (token) => {
  const dataOperator = operators.get(token);
  const lengthOperatorStack = operatorStack.length;

  if (token === "(") {
    operatorStack.push({ operator: token, ...dataOperator });

    return;
  }

  if (token === ")") {
    let operatorData = operatorStack.pop();

    while (operatorData.operator !== "(") {
      outputQueue.push(operatorData);
      operatorData = operatorStack.pop();
    }

    return;
  }

  if (lengthOperatorStack >= 1) {
    let lastOperator = operatorStack.at(-1);

    while (
      operatorStack.length &&
      lastOperator.precedence >= dataOperator.precedence
    ) {
      lastOperator = operatorStack.pop();
      outputQueue.push(lastOperator);
      lastOperator = operatorStack.at(-1);
    }
  }

  operatorStack.push({ operator: token, ...dataOperator });
};

const isTokenNumber = (value) => value.trim() !== "" && !isNaN(value);

const parser = (token) => {
  if (operators.has(token)) {
    parseOperator(token);

    return;
  }

  if (isTokenNumber(token)) {
    const operand = Number.parseFloat(token);

    outputQueue.push(operand);
  }
};

const calculationsReversePolishNsotation = () =>
  outputQueue.reduce((stack, token) => {
    if (token instanceof Object) {
      const operandRigth = stack.pop();
      const operandLeft = stack.pop();

      stack.push(operationCases(token.operator, operandLeft, operandRigth));

      return stack;
    }

    stack.push(token);

    return stack;
  }, []);

const parsExpression = (expression) => {
  for (let char of expression) {
    parser(char);
  }

  outputQueue = outputQueue.concat(operatorStack.reverse());

  resultCalculation = calculationsReversePolishNsotation();

  return;
};

const cleanData = () => {
  operatorStack.length = 0;
  outputQueue.length = 0;
  resultCalculation = "";
};

const outputQueueToString = () => {
  let result = "";

  outputQueue.forEach((token) => {
    token.operator ? (result += token.operator) : (result += token);
  });

  return result;
};

const getResultCalculation = () => resultCalculation;

const getReversePolishNsotation = () => outputQueueToString();
