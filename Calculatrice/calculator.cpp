#include <iostream>
#include <cmath>

// Fonction d'addition
extern "C" double add(double a, double b) {
    return a + b;
}

// Fonction de soustraction
extern "C" double subtract(double a, double b) {
    return a - b;
}

// Fonction de multiplication
extern "C" double multiply(double a, double b) {
    return a * b;
}

// Fonction de division
extern "C" double divide(double a, double b) {
    if (b == 0) {
        std::cerr << "Erreur: division par zéro" << std::endl;
        return 0;  // Retourne 0 en cas d'erreur de division
    } else {
        return a / b;
    }
}

// Fonction de modulo
extern "C" double modulo(double a, double b) {
    if (b == 0) {
        std::cerr << "Erreur: division par zéro" << std::endl;
        return 0;
    } else {
        return fmod(a, b);  // fmod pour les doubles
    }
}

// Fonction de calcul de factorielle (approximation pour les petits entiers)
extern "C" double factorial(int a) {
    if (a < 0) {
        std::cerr << "Erreur: facteur négatif pour la factorielle" << std::endl;
        return 0;
    }

    double result = 1;
    for (int i = 1; i <= a; i++) {
        result *= i;
    }
    return result;
}

// Fonction de puissance
extern "C" double power(double base, int exp) {
    return pow(base, exp);
}

// Fonction de racine carrée
extern "C" double squareRoot(double a) {
    if (a < 0) {
        std::cerr << "Erreur: racine carrée d'un nombre négatif" << std::endl;
        return -1;  // Retourne -1 en cas d'erreur
    }
    return sqrt(a);
}
