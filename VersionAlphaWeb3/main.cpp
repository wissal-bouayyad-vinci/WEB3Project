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

        // Fonction pour appliquer un filtre de flou
        void blur(uint8_t* image, int width, int height, int radius) {
            uint8_t* temp = new uint8_t[width * height * 4];
            for (int i = 0; i < width * height * 4; i++) {
                temp[i] = image[i];
            }

            for (int i = 0; i < width * height * 4; i += 4) {
                int r = 0;
                int g = 0;
                int b = 0;
                int count = 0;
                for (int x = -radius; x <= radius; x++) {
                    for (int y = -radius; y <= radius; y++) {
                        int nx = i + x * 4;
                        int ny = i + y * width * 4;
                        if (nx >= 0 && nx < width * height * 4 && ny >= 0 && ny < width * height * 4) {
                            r += temp[nx];
                            g += temp[nx + 1];
                            b += temp[nx + 2];
                            count++;
                        }
                    }
                
                }
                image[i] = r / count;
                image[i + 1] = g / count;
                image[i + 2] = b / count;
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