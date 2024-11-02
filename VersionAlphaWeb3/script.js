// Charger le module WebAssembly
const loadWasmModule = async () => {
    const wasmModule = await fetch('image_filters.wasm');
    const buffer = await wasmModule.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer);
    return instance.exports;
};

let isInverted = false;
let basicOpacity = 100;
let basicBlur = 0;
let basicGrayscale = 0;

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
            basicGrayscale = args[0];
            if(isInverted) {
                wasm.colorInvert(ptr, width, height);
            }
            wasm.opacity(ptr, width, height, basicOpacity);
            wasm.blur(ptr, width, height, basicBlur);
            wasm.grayscale(ptr, width, height, basicGrayscale);
            break;
        case 'colorInvert':
            isInverted = !isInverted;
            wasm.opacity(ptr, width, height, basicOpacity);
            wasm.grayscale(ptr, width, height, basicGrayscale);
            wasm.blur(ptr, width, height, basicBlur);
            wasm.colorInvert(ptr, width, height);

            if(!isInverted) {
                wasm.colorInvert(ptr, width, height);
            }
            break;
        case 'blur':
            basicBlur = args[0];
            if(isInverted) {
                wasm.colorInvert(ptr, width, height);
            }
            wasm.opacity(ptr, width, height, basicOpacity);
            wasm.grayscale(ptr, width, height, basicGrayscale);
            wasm.blur(ptr, width, height, basicBlur);
            break;
        case 'opacity':
            basicOpacity = args[0];
            if(isInverted) {
                wasm.colorInvert(ptr, width, height);
            }
            wasm.grayscale(ptr, width, height, basicGrayscale);
            wasm.blur(ptr, width, height, basicBlur);
            wasm.opacity(ptr, width, height, basicOpacity);
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

const resetFilters = () => {
    console.log('Resetting filters');
    isInverted = false;        
    basicOpacity = 100;       
    basicBlur = 0;            
    basicGrayscale = 0;       
};