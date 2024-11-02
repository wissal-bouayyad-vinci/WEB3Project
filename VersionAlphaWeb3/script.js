// Charger le module WebAssembly avec une mémoire initiale plus grande
const loadWasmModule = async () => {
    const memory = new WebAssembly.Memory({
        initial: 1000,  // Alloue environ 64MB de mémoire initiale
        maximum: 2000   // Maximum d'environ 128MB
    });

    const wasmModule = await fetch('image_filters.wasm');
    const buffer = await wasmModule.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer, {
        env: {
            memory: memory
        }
    });
    return instance.exports;
};

// Fonction pour appliquer un filtre
const applyFilter = async (filterName, imageData, width, height, ...args) => {
    const wasm = await loadWasmModule();
    const imageBuffer = new Uint8Array(imageData.data);
    
    // Vérifier si nous avons assez de mémoire
    const requiredMemory = imageBuffer.length * 2; // Pour l'image et le buffer temporaire
    const currentMemory = wasm.memory.buffer.byteLength;
    
    if (requiredMemory > currentMemory) {
        const requiredPages = Math.ceil(requiredMemory / (64 * 1024));
        try {
            wasm.memory.grow(requiredPages);
        } catch (e) {
            throw new Error("Not enough memory available for this operation");
        }
    }

    const ptr = wasm.malloc(imageBuffer.length);
    if (!ptr) {
        throw new Error("Memory allocation failed");
    }

    try {
        const wasmMemory = new Uint8Array(wasm.memory.buffer);
        wasmMemory.set(imageBuffer, ptr);

        // Appliquer le filtre sélectionné
        switch (filterName) {
            case 'blur':
                wasm.blur(ptr, width, height, args[0]);
                break;
            case 'grayscale':
                wasm.grayscale(ptr, width, height, args[0]);
                break;
            case 'colorInvert':
                wasm.colorInvert(ptr, width, height);
                break;
            case 'opacity':
                wasm.opacity(ptr, width, height, args[0]);
                break;
            default:
                throw new Error('Unknown filter');
        }

        imageBuffer.set(wasmMemory.slice(ptr, ptr + imageBuffer.length));
        imageData.data.set(imageBuffer);
        
        return imageData;
    } finally {
        wasm.free(ptr);
    }
};