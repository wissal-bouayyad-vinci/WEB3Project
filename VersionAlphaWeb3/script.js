// Charger le module WebAssembly
const loadWasmModule = async () => {
    const wasmModule = await fetch('image_filters.wasm');
    const buffer = await wasmModule.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer);
    return instance.exports;
};

// Fonction pour appliquer un filtre
const applyFilter = async (filterName, imageData, width, height, ...args) => {
    const wasm = await loadWasmModule();
    const imageBuffer = new Uint8Array(imageData.data);
    const ptr = wasm.malloc(imageBuffer.length); // Allocate memory in WASM
    const wasmMemory = new Uint8Array(wasm.memory.buffer);

    // Copy the image data to WASM memory
    wasmMemory.set(imageBuffer, ptr);

    // Apply the selected filter
    switch (filterName) {
        case 'grayscale':
            wasm.grayscale(ptr, width, height, args[0]);
            break;
        case 'colorInvert':
            wasm.colorInvert(ptr, width, height);
            break;
        case 'blur':
            wasm.blur(ptr, width, height, args[0]);
            break;
        case 'opacity':
            wasm.opacity(ptr, width, height, args[0]);
            break;
        default:
            console.error('Filtre non reconnu');
            wasm.free(ptr); // Free allocated memory
            return;
    }

    // Copy the modified data back to the imageData object
    imageBuffer.set(wasmMemory.slice(ptr, ptr + imageBuffer.length));
    imageData.data.set(imageBuffer);

    // Free allocated memory in WASM
    wasm.free(ptr);
    return imageData;
};
