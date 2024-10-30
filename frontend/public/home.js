
const main = document.querySelector('main');
const container = document.createElement("div");

const headerContainer = document.createElement("div");
headerContainer.style.backgroundColor = "#ffbad5"; 
headerContainer.style.padding = "20px"; 
headerContainer.style.borderRadius = "10px"; 
headerContainer.style.textAlign = "center";
headerContainer.style.marginBottom = "90px"; 

const text = document.createElement("h1");
text.innerHTML = "Welcome to this picture editor made in WebAssembly!";
text.style.color = "#8f3fff";
headerContainer.appendChild(text);

const description = document.createElement("h2");
description.innerHTML = "Upload an image and apply filters to it!";
description.style.color = "#8f3fff";
headerContainer.appendChild(description);

container.appendChild(headerContainer);

let uploadedImage = null;

const imageElement = document.createElement("img");
imageElement.style.maxWidth = "600px"; 
imageElement.style.maxHeight = "400px"; 
imageElement.style.borderRadius = "10px";
imageElement.style.display = "none";
imageElement.style.marginRight = "500px"; 

const imageButtonContainer = document.createElement("div");
imageButtonContainer.style.display = "flex"; 
imageButtonContainer.style.alignItems = "flex-start"; 
imageButtonContainer.style.justifyContent = "space-between";
imageButtonContainer.style.marginTop = "20px"; 
imageButtonContainer.style.textAlign = "center";

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
}

function createButtonContainer(buttonText, onClickAction) {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.backgroundColor = "#a96dff"; 
    buttonContainer.style.borderRadius = "10px"; 
    buttonContainer.style.padding = "10px"; 
    buttonContainer.style.marginTop = "20px"; 
    buttonContainer.style.textAlign = "center";
    buttonContainer.style.marginLeft = "50px"; 

    const button = document.createElement("button");
    button.innerHTML = buttonText; 
    button.style.backgroundColor = "transparent"; 
    button.style.color = "white";
    button.style.border = "none";
    button.style.fontSize = "24px";
    button.style.cursor = "pointer";

    button.onclick = async () => {
        onClickAction();
    };

    buttonContainer.appendChild(button);
    return buttonContainer;
}

const deleteButtonContainer = createButtonContainer("Delete Image", () => {
    console.log("delete image");
    uploadedImage = null; 
    imageElement.style.display = "none"; 
    showButtons(); 
});
buttonContainer.appendChild(deleteButtonContainer);

const goBackContainer = createButtonContainer("Go back to original", () => {
    console.log("go back");
});
buttonContainer.appendChild(goBackContainer);

const grayscaleContainer = createButtonContainer("Grayscale", () => {
    console.log("apply grayscale");
});
buttonContainer.appendChild(grayscaleContainer);

const blurContainer = createButtonContainer("Blur", () => {
    console.log("apply blur");
});
buttonContainer.appendChild(blurContainer);

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
});


buttonContainer.appendChild(uploadButton); 

main.appendChild(container);
