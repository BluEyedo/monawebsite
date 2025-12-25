const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
// const text = dropzone.querySelector("p");

// CLICK to open file dialog
dropzone.addEventListener("click", () => fileInput.click());

// Show image card
function showImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "relative";

    const img = document.createElement("img");
    img.src = e.target.result;
    img.className = "w-full h-32 object-cover rounded border";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.className =
      "absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer";

    closeBtn.onclick = () => {
      imgWrapper.remove();

      // Show message if no images left
      // if (previewContainer.children.length === 0) {
      //   text.style.display = "block";
      // }
    };

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(closeBtn);
    previewContainer.appendChild(imgWrapper);

    // text.style.display = "none";
  };

  reader.readAsDataURL(file);
}

// When selecting via input
fileInput.addEventListener("change", () => {
  [...fileInput.files].forEach((file) => {
    if (file.type.startsWith("image/")) {
      showImage(file);
    }
  });
});

// Drag and drop
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  [...e.dataTransfer.files].forEach((file) => {
    if (file.type.startsWith("image/")) {
      showImage(file);
    }
  });
});
