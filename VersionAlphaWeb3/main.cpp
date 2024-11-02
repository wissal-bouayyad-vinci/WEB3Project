   #include <stdint.h>

    
    extern "C" {
        // Fonction pour appliquer un filtre de gris
        void grayscale(uint8_t* image, int width, int height, float intensity) {
            for (int i = 0; i < width * height * 4; i += 4) {
                uint8_t r = image[i];
                uint8_t g = image[i + 1];
                uint8_t b = image[i + 2];

                // Calcul du gris
                uint8_t gray = (uint8_t)(0.299 * r + 0.587 * g + 0.114 * b);

                // Appliquer l'intensitÃ© de gris
                image[i] = r * (1 - intensity) + gray * intensity;
                image[i + 1] = g * (1 - intensity) + gray * intensity;
                image[i + 2] = b * (1 - intensity) + gray * intensity;
            }
        }
        // Fonction pour appliquer un filtre d'inversion de couleur
        void colorInvert(uint8_t* image, int width, int height) {
            for (int i = 0; i < width * height * 4; i += 4) {
                image[i] = 255 - image[i];
                image[i + 1] = 255 - image[i + 1];
                image[i + 2] = 255 - image[i + 2];
            }
        }

void blur(uint8_t* image, int width, int height, int radius) {
    uint8_t* temp = new uint8_t[width * height * 4];

    // Première passe horizontale
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            int r = 0, g = 0, b = 0, count = 0;
            for (int k = -radius; k <= radius; k++) {
                int nx = x + k;
                if (nx >= 0 && nx < width) {  // Assurez-vous de ne pas dépasser les limites
                    r += image[(y * width + nx) * 4];
                    g += image[(y * width + nx) * 4 + 1];
                    b += image[(y * width + nx) * 4 + 2];
                    count++;
                }
            }
            temp[(y * width + x) * 4] = r / count;
            temp[(y * width + x) * 4 + 1] = g / count;
            temp[(y * width + x) * 4 + 2] = b / count;
        }
    }

    // Deuxième passe verticale
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            int r = 0, g = 0, b = 0, count = 0;
            for (int k = -radius; k <= radius; k++) {
                int ny = y + k;
                if (ny >= 0 && ny < height) {  // Assurez-vous de ne pas dépasser les limites
                    r += temp[(ny * width + x) * 4];
                    g += temp[(ny * width + x) * 4 + 1];
                    b += temp[(ny * width + x) * 4 + 2];
                    count++;
                }
            }
            image[(y * width + x) * 4] = r / count;
            image[(y * width + x) * 4 + 1] = g / count;
            image[(y * width + x) * 4 + 2] = b / count;
        }
    }

    delete[] temp;
}


        // filtre d'opacity
        void opacity(uint8_t* image, int width, int height, float opacity) {
            for (int i = 0; i < width * height * 4; i += 4) {
                image[i+3] = image[i+3] * opacity;
            }
        }

        




    }