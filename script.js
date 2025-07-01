document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons button');
    
    let currInput = '0';
    let prevInput = '';
    let operation = null;
    let shouldReset = false;
    let equationDisplay = '';

    function updateDisplay() {
        display.value = shouldReset ? currInput : (equationDisplay || currInput);
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
        if (shouldReset) return;
        
        if (currInput.length === 1) {
            currInput = '0';
        } else {
            currInput = currInput.slice(0, -1);
        }
        
        if (operation === null) {
            equationDisplay = equationDisplay.slice(0, -1);
            if (equationDisplay === '') equationDisplay = currInput;
        }
        
        updateDisplay();
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
        
        if (operation === null) {
            equationDisplay = currInput;
        } else {
            equationDisplay = prevInput + ' ' + operation + ' ' + currInput;
        }
        
        updateDisplay();
    }
    
    function appendDecimal() {
        if (shouldReset) {
            resetCalculator();
        }
        
        if (!currInput.includes('.')) {
            currInput += currInput === '' ? '0.' : '.';
        }
        
        if (operation === null) {
            equationDisplay = currInput;
        } else {
            equationDisplay = prevInput + ' ' + operation + ' ' + currInput;
        }
        
        updateDisplay();
    }
    
    function chooseOperation(op) {
        if (operation !== null && currInput !== '') {
            calculate(false);
        }
        
        if (currInput !== '' || prevInput !== '') {
            operation = op;
            prevInput = currInput === '' ? prevInput : currInput;
            equationDisplay = prevInput + ' ' + operation + ' ';
            currInput = '';
            shouldReset = false;
            updateDisplay();
        }
    }

    function power(x, n) {
        if (n === 0) return 1;
        if (x === 0 && n < 0) return "Error";
        
        let result = 1;
        const posN = Math.abs(n);
        
        for (let i = 0; i < posN; i++) {
            result *= x;
        }
        
        return n < 0 ? 1 / result : result;
    }
    
    function calculate(finalCalculation = true) {
        if (operation === null || currInput === '') return;
        
        const prev = parseFloat(prevInput);
        const current = parseFloat(currInput);
        let result;
        
        switch (operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '*': result = prev * current; break;
            case '/': result = prev / current; break;
            case '^': result = power(prev, current); break;
            default: return;
        }
        
        currInput = result.toString();
        if (finalCalculation) {
            // show only results after calculation
            equationDisplay = '';
            prevInput = '';
            operation = null;
        } else {
            // chained equations
            equationDisplay = currInput + ' ' + operation + ' ';
            prevInput = currInput;
        }
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