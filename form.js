// formStorage.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");
    const iframe = document.querySelector("iframe"); // تحديد iframe


    // تحويل صورة إلى Base64
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // منع الإرسال الفعلي

        const formData = {};
        const elements = form.elements;

        // جمع البيانات
        formData.name = elements["name"].value;
        formData.job = elements["job"].value;
        formData.date = elements["date"].value;
        formData.details = elements["details"].value; // الحقل الثاني job في textarea
        formData.category = elements["category"].value;

        // صورة الباركود
        if (fileInput.files[0]) {
            formData.barcodeImage = await getBase64(fileInput.files[0]);
        } else {
            formData.barcodeImage = null;
        }

        // جلب البيانات الحالية من localStorage
        const currentData = JSON.parse(localStorage.getItem("employeeData") || "[]");
        currentData.push(formData);

        // حفظها مرة أخرى
        localStorage.setItem("employeeData", JSON.stringify(currentData));

        // إعادة ضبط النموذج
        form.reset();
        preview.src = "";
        preview.style.display = "none";

        // إعادة تحميل iframe تلقائياً
        if (iframe) {
            iframe.src = iframe.src;
        }

        const data = JSON.parse(localStorage.getItem("employeeData") || "[]");
        // حساب المهام المكتملة وغير المكتملة
        const done = data.filter(item => item.category == "1").length;
        const notDone = data.filter(item => item.category == "2").length;
        // عرض الأرقام
        document.getElementById("doneCount").textContent = `🟢 تم إنجازه: ${done}`;
        document.getElementById("notDoneCount").textContent = `🔴 ما لم تم إنجازه: ${notDone}`;

        alert("تم حفظ البيانات في LocalStorage بنجاح!");
    });

    // عرض صورة عند اختيار الملف
    fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });
});
