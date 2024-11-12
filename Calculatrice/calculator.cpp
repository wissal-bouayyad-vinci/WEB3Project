#include <iostream>

extern "C" {

// Addition
long long add(int a, int b) {
    return a + b;
}

// Soustraction
long long subtract(int a, int b) {
    return a - b;
}

// Multiplication
long long multiply(int a, int b) {
    return a * b;
}

// Division
long long divide(int a, int b) {
    if (b == 0) {
        return 0; // Gérer la division par zéro
    }
    return a / b;
}

// Modulo
long long modulo(int a, int b) {
    if (b == 0) {
        return 0; // Gérer la division par zéro
    }
    return a % b;

}

// Factorial
long long factorial(int a) {
    if (a == 0) {
        return 1;
    }
    return a * factorial(a - 1);
}

// Power
long long power(int a, int b) {
    long long result = 1;
    for (int i = 0; i < b; i++) {
        result *= a;
    }
    return result;
}

// Square root
double squareRoot(int a) {
    return sqrt(a);
}



}
