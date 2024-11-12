// Charger le module WebAssembly
Module().then((module) => {
    // Fonctions Wasm exposées
    const add = module._add;
    const subtract = module._subtract;
    const multiply = module._multiply;
    const divide = module._divide;
    const modulo = module._modulo;
    const factorial = module._factorial;
    const power = module._power;
    const squareRoot = module._squareRoot;

    // Fonction pour gérer les opérations
    function calculate(operation, a, b = 0) {
        a = Number(a);  // Convertir en nombre
        b = Number(b);  // Convertir en nombre

        switch (operation) {
            case '+':
                return add(a, b);
            case '-':
                return subtract(a, b);
            case '*':
                return multiply(a, b);
            case '/':
                return divide(a, b);
            case '%':
                return modulo(a, b);
            case 'factorial':
                return factorial(a);
            case 'power':
                return power(a, b);
            case 'sqrt':
                return squareRoot(a);
            default:
                return "Invalid operation";
        }
    }

    // Exemple d'appel
    console.log("3 + 4 =", calculate('+', 3, 4));
    console.log("5 % 3 =", calculate('%', 5, 3));
    console.log("Factorial de 5 =", calculate('factorial', 5));
    console.log("2 puissance 3 =", calculate('power', 2, 3));
    console.log("Racine de 16 =", calculate('sqrt', 16));
});
