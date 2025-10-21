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
          <title>_</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
          
           @page {
                @top-center { content: none; }
                @top-left { content: none; }
                @top-right { content: none; }
                @bottom-left { content: none; }
                @bottom-center { content: none; }
                @bottom-right { content: none; }
            }

            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: right;
            }
            th {
              background-color: #eee;
            }
            img {
              width: 50px;
              height: 50px;
            }
      
          </style>
        </head>
        <body class="cairo-font">
        
          <div class=" p-4">
            <div class="flex justify-between mb-6">
              <div class="flex flex-col items-center">
                <img class="h-[60px] w-auto" src="../ksa.png" />
                <p>وزارة التعليم</p>
                <p>الإدارة العامة للتعليم بمنطقة مكة المكرمة</p>
              </div>
              <img class="h-[120px] w-auto" src="../taleem.png" />
            </div>
  
            <p class="font-bold text-xl text-center">مقدم خدمات دعم التميز المدرسي</p>
            <p class="font-bold text-xl text-center mb-5">
              أ. منى غالي غانم الصاعدي
            </p>
            <table>
              <thead>
                <tr>
                  <th class="text-xs">م</th>
                  <th class="text-xs">التاريخ</th>
                  <th class="text-xs">اسم المدرسة</th>
                  <th class="text-xs">اللجنة</th>
                  <th class="text-xs">الأسلوب الإشرافي</th>
                  <th class="text-xs">حالة الإنجاز</th>
                  <th class="text-xs">صورة الباركود</th>
                </tr>
              </thead>
              <tbody>
                ${data
        .map(
          (item, index) => `
                  <tr>
                    <td class="text-xs">${index + 1}</td>
                    <td class="text-xs">${findDay(item.date)} ${item.date}</td>
                    <td class="text-xs">${item.name}</td>
                    <td class="text-xs">${item.job}</td>
                    <td class="text-xs">${item.details}</td>
                    <td class="text-xs">${item.category == "1" ? "تم الإنجاز" : "لم يتم الإنجاز"}</td>
                    <td class="text-xs">${item.barcodeImage
              ? `<img src="${item.barcodeImage}" />`
              : ""
            }</td>
                  </tr>
                `
        )
        .join("")}
              </tbody>
            </table>
          </div>
  
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  });

  // تصدير إلى Excel
  exportBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("employeeData") || "[]");

    let csv =
      "م,التاريخ,اسم الموظفة,اللجنة,الأسلوب الإشرافي,حالة الإنجاز,صورة الباركود\n";

    data.forEach((item, index) => {
      const clean = (str) => `"${(str || "").toString().replace(/"/g, '""')}"`;
      csv +=
        [
          index + 1,
          clean(item.date),
          clean(item.name),
          clean(item.job),
          clean(item.details),
          clean(item.category == "1" ? "تم الإنجاز" : "لم يتم الإنجاز"),
          clean(item.barcodeImage ? "[image]" : ""),
        ].join(",") + "\n";
    });

    // إضافة BOM في بداية CSV لحل مشكلة العربية
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "نموذج_حصر_إنجاز_الموظفة.csv";
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
      const done = data.filter((item) => item.category == "1").length;
      const notDone = data.filter((item) => item.category == "2").length;

      // عرض الأرقام
      document.getElementById(
        "doneCount"
      ).textContent = `🟢 تم إنجازه: ${done}`;
      document.getElementById(
        "notDoneCount"
      ).textContent = `🔴  لم يتم إنجازه: ${notDone}`;
    }
  });
});
