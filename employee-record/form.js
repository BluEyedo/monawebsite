// formStorage.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("previewContainer");
    const iframe = document.querySelector("iframe");

    const STORAGE_KEY = "employeeData";

    // Convert file to Base64
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const getStoredData = () =>
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const saveData = (data) =>
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const updateCounters = (data) => {
        const done = data.filter((i) => i.category === "1").length;
        const notDone = data.filter((i) => i.category === "2").length;

        document.getElementById("doneCount").textContent = `🟢 تم إنجازه: ${done}`;
        document.getElementById("notDoneCount").textContent = `🔴 لم يتم إنجازه: ${notDone}`;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const elements = form.elements;

        const formData = {
            name: elements.name.value.trim(),
            job: elements.job.value.trim(),
            benefited: elements.benefited.value,
            amount: elements.amount.value,
            day: elements.day.value,
            date: elements.date.value,
            category: elements.category.value,
            details: elements.details.value.trim(),
            objectives: elements.objectives.value.trim(),
            indicators: elements.indicators.value.trim(),
            suggestions: elements.suggestions.value.trim(),
            barcodeImage: null,
        };

        // Handle file upload (single image)
        formData.barcodeImage = [];
        for (const file of fileInput.files) {
            const base64Image = await getBase64(file);
            formData.barcodeImage.push(base64Image);
        }

        const data = getStoredData();
        data.push(formData);
        saveData(data);

        form.reset();
        preview.style.display = "none";
        preview.src = "";

        if (iframe) iframe.contentWindow.location.reload();

        updateCounters(data);

        alert("تم حفظ البيانات بنجاح ✅");
    });

    // Image preview
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = "flex";
        };
        reader.readAsDataURL(file);
    });
});
