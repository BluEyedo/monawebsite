function findDay(dateString) {
  var dateArr = dateString.split("-");

  // Create a Date object: year, month (0-based), day
  const date = new Date(dateArr[2], parseInt(dateArr[1]) - 1, dateArr[0]); // February is month 1

  // Get the day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayIndex = date.getDay();

  // Map the number to a day name
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const dayName = days[dayIndex];

  return dayName;
}

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
                  <th>م</th>
                  <th>التاريخ</th>
                  <th>اسم المدرسة</th>
                  <th>اللجنة</th>
                  <th>الأسلوب الإشرافي</th>
                  <th>حالة الإنجاز</th>
                  <th>صورة الباركود</th>
                </tr>
              </thead>
              <tbody>
                ${data
        .map(
          (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${findDay(item.date)} ${item.date}</td>
                    <td>${item.name}</td>
                    <td>${item.job}</td>
                    <td>${item.details}</td>
                    <td>${item.category == "1" ? "تم الإنجاز" : "لم يتم الإنجاز"}</td>
                    <td>${item.barcodeImage
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
