document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons button');

    let currInput = '0';
    let prevInput = '';
    let operation = null;
    let shouldReset = false;
    let equationDisplay = '';

    function updateDisplay() {
        display.value = equationDisplay || currInput;
    }

    function resetCalculator() {
        currInput = '0';
        prevInput = '';
        operation = null;
        shouldReset = false;
        equationDisplay = '';
        updateDisplay();
    }

    function deleteLastChar() {
        if (shouldReset) {
            resetCalculator();
            return;
        }

        if (currInput.length > 1) {
            currInput = currInput.slice(0, -1);
        } else {
            currInput = '0';
        }

        updateEquationDisplay();
        updateDisplay();
    }

    function updateEquationDisplay() {
        if (operation === null) {
            equationDisplay = '';
        } else {
            equationDisplay = `${prevInput} ${operation} ${currInput}`;
        }
    }

    function appendNumber(number) {
        if (shouldReset) {
            resetCalculator();
        }

        if (currInput === '0') {
            currInput = number;
        } else {
            currInput += number;
        }

        updateEquationDisplay();
        updateDisplay();
    }

    function appendDecimal() {
        if (shouldReset) {
            resetCalculator();
        }

        if (!currInput.includes('.')) {
            currInput += '.';
        }

        updateEquationDisplay();
        updateDisplay();
    }

    function chooseOperation(op) {
        if (operation !== null && currInput !== '') {
            calculate(false);
        }

        if (currInput !== '') {
            prevInput = currInput;
            currInput = '';
        }

        operation = op;
        updateEquationDisplay();
        updateDisplay();
    }

    function calculate(finalCalculation = true) {
        if (operation === null || currInput === '' || prevInput === '') return;

        const prev = parseFloat(prevInput);
        const current = parseFloat(currInput);
        let result;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current === 0 ? 'Error' : prev / current;
                break;
            case '^':
                result = prev === 0 && current < 0 ? 'Error' : Math.pow(prev, current);
                break;
            default:
                return;
        }

        currInput = result.toString();
        equationDisplay = finalCalculation ? '' : `${prevInput} ${operation} ${currInput}`;
        prevInput = currInput;
        operation = null;
        shouldReset = true;

        updateDisplay();
    }

    // Event listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                appendNumber(button.textContent);
            } else if (button.classList.contains('operator')) {
                chooseOperation(button.textContent);
            } else if (button.classList.contains('equals')) {
                calculate();
            } else if (button.classList.contains('decimal')) {
                appendDecimal();
            } else if (button.classList.contains('clear')) {
                resetCalculator();
            } else if (button.classList.contains('del')) {
                deleteLastChar();
            }
        });
    });

    resetCalculator();
});
