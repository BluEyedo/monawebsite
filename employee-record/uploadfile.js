const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const text = dropzone.querySelector("p");

// Create close button
theCloseBtn = document.createElement("button");
theCloseBtn.textContent = "✕";
theCloseBtn.style.position = "absolute";
theCloseBtn.style.top = "8px";
theCloseBtn.style.right = "8px";
theCloseBtn.style.background = "rgba(0,0,0,0.6)";
theCloseBtn.style.color = "#fff";
theCloseBtn.style.border = "none";
theCloseBtn.style.borderRadius = "50%";
theCloseBtn.style.width = "24px";
theCloseBtn.style.height = "24px";
theCloseBtn.style.cursor = "pointer";
theCloseBtn.style.display = "none";
dropzone.appendChild(theCloseBtn);

function showImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = "block";
    text.style.display = "none";
    theCloseBtn.style.display = "block";
  };
  reader.readAsDataURL(file);
}

theCloseBtn.addEventListener("click", () => {
  preview.src = "";
  preview.style.display = "none";
  text.style.display = "block";
  fileInput.value = "";
  theCloseBtn.style.display = "none";
});

// When file input changes
fileInput.addEventListener("change", () => {
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    showImage(file);
  }
});

// Drag and drop events
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

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    showImage(file);
  }
});