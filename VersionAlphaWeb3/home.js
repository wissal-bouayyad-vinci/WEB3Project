const main = document.querySelector('main');
const container = document.createElement("div");

const headerContainer = document.createElement("div");
headerContainer.style.backgroundColor = "#ffbad5";
headerContainer.style.padding = "20px";
headerContainer.style.borderRadius = "10px";
headerContainer.style.textAlign = "center";
headerContainer.style.marginBottom = "-20px";

const text = document.createElement("h1");
text.innerHTML = "Welcome to this picture editor made in WebAssembly!";
text.style.color = "#8f3fff";
text.style.fontSize = "40px";
text.style.marginTop = "80px";
headerContainer.appendChild(text);

const description = document.createElement("h2");
description.innerHTML = "Upload an image and apply filters to it!";
description.style.color = "#8f3fff";
headerContainer.appendChild(description);

container.appendChild(headerContainer);

let uploadedImage = null;
let originalImage = null; 
const imageElement = document.createElement("img");
imageElement.style.maxWidth = "600px";
imageElement.style.maxHeight = "400px";
imageElement.style.borderRadius = "10px";
imageElement.style.display = "none";

const imageButtonContainer = document.createElement("div");
imageButtonContainer.style.display = "flex";
imageButtonContainer.style.alignItems = "flex-start";
imageButtonContainer.style.justifyContent = "space-between";
imageButtonContainer.style.marginTop = "20px";

const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";
buttonContainer.style.flexDirection = "column";
buttonContainer.style.marginRight = "20px";

imageButtonContainer.appendChild(buttonContainer);
imageButtonContainer.appendChild(imageElement);
container.appendChild(imageButtonContainer);

function displayImage(imageFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage = event.target.result;
        originalImage = uploadedImage; 
        imageElement.src = uploadedImage;
        imageElement.style.display = "block";
        showButtons();
    };
    reader.readAsDataURL(imageFile);
}

function showButtons() {
    deleteButtonContainer.style.display = "block";
    goBackContainer.style.display = "block";
    grayscaleContainer.style.display = "block";
    blurContainer.style.display = "block";
    invertContainer.style.display = "block";
    opacityContainer.style.display = "block";
}

function createButtonContainer(buttonText, onClickAction, filterType) {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.backgroundColor = "#a96dff";
    buttonContainer.style.borderRadius = "10px";
    buttonContainer.style.padding = "8px";
    buttonContainer.style.marginTop = "20px";
    buttonContainer.style.textAlign = "center";
    buttonContainer.setAttribute('data-filter-type', filterType);

    const button = document.createElement("button");
    button.innerHTML = buttonText;
    button.style.backgroundColor = "transparent";
    button.style.color = "white";
    button.style.border = "none";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";

    button.onclick = async () => {
        onClickAction(getSliderValue(filterType));
    };

    buttonContainer.appendChild(button);

    if (filterType === "grayscale" || filterType === "blur" || filterType === "opacity") {
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = "0"; 
        slider.style.width = "100%";
        slider.style.marginTop = "10px";
        slider.setAttribute("data-slider", filterType);

        if(filterType === 'opacity') {
            slider.value = 100;
        }

        const sliderValueDisplay = document.createElement("span");
        sliderValueDisplay.innerHTML = ` ${slider.value}`;
        slider.oninput = () => {
            sliderValueDisplay.innerHTML = ` ${slider.value}`;
        };

        buttonContainer.appendChild(slider);
        buttonContainer.appendChild(sliderValueDisplay);
    }

    return buttonContainer;
}

function getSliderValue(filterType) {
    const slider = document.querySelector(`input[data-slider="${filterType}"]`);
    return slider ? parseInt(slider.value) : 0;
}

async function applyWasmFilter(filterName, ...args) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    const img = new Image();
    img.src = originalImage; 
    img.onload = () => {
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        applyFilter(filterName, imageData, canvas.width, canvas.height, ...args).then(resultData => {
            context.putImageData(resultData, 0, 0);
            imageElement.src = canvas.toDataURL(); 
        });
    };
}

const grayscaleContainer = createButtonContainer("Grayscale", (value) => {
    value = value / 100;
    applyWasmFilter('grayscale', value);
}, 'grayscale');

const blurContainer = createButtonContainer("Blur", (value) => {
    console.log('blur value:', value);
    applyWasmFilter('blur', value);
}, 'blur');

const invertContainer = createButtonContainer("Invert Colors", () => {
    applyWasmFilter('colorInvert');
}, 'invert');

const opacityContainer = createButtonContainer("Opacity", (value) => {
    value = value / 100;
    
    applyWasmFilter('opacity', value);
}, 'opacity');

const deleteButtonContainer = createButtonContainer("Delete Image", () => {
    uploadedImage = null;
    originalImage = null; 
    imageElement.style.display = "none";
    resetAllFilters();
    fileInput.value = "";
}, 'delete');

const goBackContainer = createButtonContainer("Go back to original", () => {
    if (originalImage) {
        imageElement.src = originalImage; 
    }
    
    resetAllFilters();
}, 'go-back');

buttonContainer.appendChild(deleteButtonContainer);
buttonContainer.appendChild(goBackContainer);
buttonContainer.appendChild(grayscaleContainer);
buttonContainer.appendChild(blurContainer);
buttonContainer.appendChild(invertContainer);
buttonContainer.appendChild(opacityContainer);

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";
fileInput.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
        displayImage(file);
    }
};

container.appendChild(fileInput);
const uploadButton = createButtonContainer("Upload Image", () => {
    fileInput.click();
    resetAllFilters();
}, 'upload');
buttonContainer.appendChild(uploadButton);
main.appendChild(container);

function resetAllFilters() {
    resetFilters();
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.value = 0;
        slider.nextElementSibling.innerHTML = `0`;

        if(slider.dataset.slider === 'opacity') {
            slider.value = 100;
        slider.nextElementSibling.innerHTML = `100`;
        }
    });
}

