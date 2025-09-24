// tableActions.js
document.addEventListener("DOMContentLoaded", () => {
    const printBtn = document.querySelector("button.bg-blue-500");
    const exportBtn = document.querySelector("button.bg-cyan-500");
    const deleteBtn = document.querySelector("button.bg-red-500");

    // طباعة الجدول
    printBtn.addEventListener("click", () => {
        const data = JSON.parse(localStorage.getItem("employeeData") || "[]");

        let html = `
        <html dir="rtl">
        <head>
            <title> ... </title>
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 8px; text-align: right; }
                th { background-color: #eee; }
                img { width: 50px; height: 50px; }
            </style>
        </head>
        <body>
            <h2 style="text-align:center;">جدول إنجاز الموظفين</h2>
            <table>
                <thead>
                    <tr>
                        <th>م</th>
                        <th>اسم الموظفة</th>
                        <th>اللجنة</th>
                        <th>التاريخ</th>
                        <th>تفاصيل الإنجاز</th>
                        <th>حالة الإنجاز</th>
                        <th>صورة الباركود</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.job}</td>
                            <td>${item.date}</td>
                            <td>${item.details}</td>
                            <td>${item.category}</td>
                            <td>${item.barcodeImage ? `<img src="${item.barcodeImage}">` : ''}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </body>
        </html>
        `;

        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    });

    // تصدير إلى Excel
    exportBtn.addEventListener("click", () => {
        const data = JSON.parse(localStorage.getItem("employeeData") || "[]");

        let csv = "م,اسم الموظفة,اللجنة,التاريخ,تفاصيل الإنجاز,حالة الإنجاز,صورة الباركود\n";

        data.forEach((item, index) => {
            const clean = str => `"${(str || "").toString().replace(/"/g, '""')}"`;
            csv += [
                index + 1,
                clean(item.name),
                clean(item.job),
                clean(item.date),
                clean(item.details),
                clean(item.category),
                clean(item.barcodeImage ? "[image]" : "")
            ].join(",") + "\n";
        });

        // إضافة BOM في بداية CSV لحل مشكلة العربية
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "employee_table.csv";
        link.click();
        URL.revokeObjectURL(url);
    });

    // حذف كامل البيانات
    deleteBtn.addEventListener("click", () => {
        if (confirm("هل أنت متأكد من حذف جميع البيانات؟")) {
            localStorage.removeItem("employeeData");
            alert("تم حذف جميع البيانات!");
            // إعادة تحميل iframe إذا موجود
            const iframe = document.querySelector("iframe");
            if (iframe) iframe.src = iframe.src;

            // حساب المهام المكتملة وغير المكتملة
            const done = data.filter(item => item.category == "1").length;
            const notDone = data.filter(item => item.category == "2").length;

            // عرض الأرقام
            document.getElementById("doneCount").textContent = `🟢 تم إنجازه: ${done}`;
            document.getElementById("notDoneCount").textContent = `🔴 ما لم يتم إنجازه: ${notDone}`;
        }
    });
});
