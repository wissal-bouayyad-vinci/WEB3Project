// Attendre que le module WebAssembly soit chargé
Module.onRuntimeInitialized = () => {
    // Fonctions Wasm exposées
    const add = Module._add;
    const subtract = Module._subtract;
    const multiply = Module._multiply;
    const divide = Module._divide;
    const modulo = Module._modulo;
    const factorial = Module._factorial;
    const power = Module._power;
    const squareRoot = Module._squareRoot;

    // Fonction de calcul
    function calculate() {
        const a = parseFloat(document.getElementById('inputA').value);
        const b = parseFloat(document.getElementById('inputB').value || 0);
        const operation = document.getElementById('operation').value;
        let result;

        try {
            switch (operation) {
                case '+':
                    result = add(a, b);
                    break;
                case '-':
                    result = subtract(a, b);
                    break;
                case '*':
                    result = multiply(a, b);
                    break;
                case '/':
                    if (b === 0) throw new Error("Error: Division by zero");
                    result = divide(a, b);
                    break;
                case '%':
                    if (b === 0) throw new Error("Error: Modulo by zero");
                    result = modulo(a, b);
                    break;
                case 'factorial':
                    if (a < 0) throw new Error("Error: Negative factorial");
                    result = factorial(a);
                    break;
                case 'power':
                    result = power(a, b);
                    break;
                case 'sqrt':
                    if (a < 0) throw new Error("Error: Square root of negative number");
                    result = squareRoot(a);
                    break;
                default:
                    result = "Invalid operation";
            }
            document.getElementById('result').innerText = result;

        } catch (error) {
            document.getElementById('result').innerText = error.message;
        }
    }

    // Gérer la visibilité de `inputB` en fonction de l'opération
    function updateInputBVisibility() {
        const operation = document.getElementById('operation').value;
        const inputB = document.getElementById('inputB');
        if (operation === 'factorial' || operation === 'sqrt') {
            inputB.style.display = 'none';
            inputB.value = ''; 
        } else {
            inputB.style.display = ''; 
        }
    }

    // Ajouter les événements
    document.getElementById('operation').addEventListener('change', updateInputBVisibility);
    document.getElementById('calculateBtn').addEventListener('click', calculate);

    updateInputBVisibility();
};
