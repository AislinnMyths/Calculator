class Calculator {
  constructor(operand1Element, operand2Element) {
    /*variables for print in screen (only inside the class)*/
    this.operand1Element = operand1Element;
    this.operand2Element = operand2Element;
    this.clear();
    /*Indicates that the last action was "=";Used to decide whether next number 
    starts a new operation*/
    this.resultDisplayed = false;
  }
  clear() {
    /* Method for resetting status and updating UI */
    this.operand1 = ""; /* upper display*/
    this.operand2 = ""; /* lower display*/
    this.operator = "";
    this.updateUI();
  }

  updateUI() {
    /*update user interface; display '0' if the string is empty */
    this.operand1Element.textContent = this.operand1
      ? this.operand1 + " " + this.operator
      : "";

    this.operand2Element.textContent = this.operand2 || "0";

    /*adjust size according to length*/
    if (this.operand2.length > 10) {
      this.operand2Element.style.fontSize = "50px";
    } else {
      this.operand2Element.style.fontSize = "70px";
    }
  }

  appendNumber(number) {
    /*After displaying the result, clear everything and indicate that no result is 
    being displayed.*/
    if (this.resultDisplayed) {
      this.operand1 = "";
      this.operand2 = "";
      this.operator = "";
      this.resultDisplayed = false;
    }
    /*point control, concatenation and prevents overflow in display and keeps UI stable*/
    if (this.operand2.length >= 12) return;
    if (number === "." && this.operand2.includes(".")) return; //return stop the if

    if (number === "." && this.operand2 === "") {
      this.operand2 = "0.";
      this.updateUI();
      return;
    }

    if (this.operand2 === "0" && number !== ".") {
      this.operand2 = number.toString();
    } else {
      this.operand2 = this.operand2 + number.toString();
    }

    this.updateUI();
  }

  delete() {
    /*delete the last number */
    if (!this.operand2) return;
    this.operand2 = this.operand2.slice(0, -1);
    this.updateUI();
  }

  chooseOperator(operator) {
    /*behaviour when pressing operator */
    if (this.operand2 === "" && this.operand1 !== "") {
      this.operator = operator;
      this.updateUI();
      return;
    }

    if (this.operand1 !== "" && this.operand2 !== "") {
      this.calc();
    }

    this.operator = operator;
    this.operand1 = this.operand2;
    this.operand2 = "";
    this.updateUI();
  }

  toggleSign() {
    if (!this.operand2) return;
    if (this.operand2.startsWith("-")) {
      this.operand2 = this.operand2.slice(1); /*remove the sign*/
    } else {
      this.operand2 = "-" + this.operand2; /*add the sign*/
    }
    this.updateUI();
  }

  calc() {
    /* If = is pressed after a result without operand2, we repeat the last operation.*/
    if (this.resultDisplayed && !this.operand2) {
      if (!this.lastOperand || !this.lastOperator) return; /*nothing to repeat*/
      this.operand2 = this.lastOperand;
      this.operator = this.lastOperator;
    }

    if (this.operand1 === "" || this.operand2 === "") return;

    const a = parseFloat(this.operand1);
    const b = parseFloat(this.operand2);
    let result;

    switch (this.operator) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "*":
        result = a * b;
        break;
      case "/":
        if (b === 0) {
          result = "Error";
          break;
        }
        result = a / b;
        break;
      default:
        return;
    }

    /*Limit decimals; toFixed avoids floating point precision errors (e.g. 0.1 + 0.2)*/ 
    if (typeof result === "number") {
      result = parseFloat(result.toFixed(12));
    }

    /*truncate visually if too long*/
    let resultStr = result.toString();
    if (resultStr.length > 12) {
      resultStr = resultStr.slice(0, 12);
    }

    /*The last operation is saved so that it can be repeated*/
    this.lastOperator = this.operator;
    this.lastOperand = this.operand2;

    this.operand1 = resultStr; //result.toString()
    this.operator = "";
    this.operand2 = "";

    /*mark that a result has just been displayed*/
    this.resultDisplayed = true;

    /*refresh screen*/
    this.updateUI();
  }
}

/*variables of elements (out of the class); the square brackets indicate attribute selectors */
const operand1Element = document.querySelector("[dataOperand1]");
const operand2Element = document.querySelector("[dataOperand2]");
const clearButton = document.querySelector("[dataClear]");
/*create the object and connect logic to the screen; creates a new instance (object), 
the constructor is executed with the arguments of the display elements*/
const calculator = new Calculator(operand1Element, operand2Element);
const numberButtons = document.querySelectorAll("[dataNumber]");
const deleteButton = document.querySelector("[dataDelete]");
const operationsButtons = document.querySelectorAll("[dataOperation]");
const equalsButton = document.querySelector("[dataEquals]");

/*The arrow function causes the function to be executed not when it is defined, but when clicked.*/
clearButton.addEventListener("click", () => {
  calculator.clear();
});

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(
      button.innerHTML,
    ); /**the buttons already have the number in the HTML, with this we collect that value */
  });
});

deleteButton.addEventListener("click", () => {
  /**when you click the delete button execute the function delete */
  calculator.delete();
});

operationsButtons.forEach((button) => {
  /**make the operations buttons make the operations when you click between numbers */
  button.addEventListener("click", () => {
    calculator.chooseOperator(
      button.innerHTML,
    ); /**the buttons already hace the operator in the HTML, with this we collect that value */
  });
});

equalsButton.addEventListener("click", () => {
  /**show the result of the  operation when you click the equal button */
  calculator.calc();
});

const signButton = document.querySelector("[dataSign]");
signButton.addEventListener("click", () => {
  calculator.toggleSign();
});
