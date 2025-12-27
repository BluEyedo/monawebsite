// tableActions.js
document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.querySelector("button.bg-blue-500");
  const exportBtn = document.querySelector("button.bg-cyan-500");
  const deleteBtn = document.querySelector("button.bg-red-500");

  printBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("employeeData") || "[]");

    const renderHeaderRow = () => `
      <tr>
        <th>م</th>
        <th>التاريخ</th>
        <th>اسم المدرسة</th>
        <th>المجال الإشرافي</th>
        <th>أسلوب التنفيذ</th>
        <th>نوعه</th>
        <th>صور الباركود</th>
      </tr>
    `;

    const renderMainRow = (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${daysDayByIndex(item.day)} ${item.date}</td>
        <td>${item.name}</td>
        <td>${findSelectedScope(item.job)}</td>
        <td>${item.details}</td>
        <td>${findSelectedType(item.category)}</td>
        <td class="images">
          ${(item.barcodeImage || [])
        .map(img => `<img src="${img}" />`)
        .join("")}
        </td>
      </tr>
    `;

    const renderNestedRows = (item) => `
      <tr class="nested-header">
        <td colspan="3">الأهداف التفصيلية للأسلوب الإشرافي</td>
        <td colspan="2">المؤشرات الدالة على تحقق المستهدفات</td>
        <td colspan="2">توصيات عامة لتحسين الممارسات</td>
      </tr>
      <tr>
        <td colspan="3">${item.objectives || ""}</td>
        <td colspan="2">${item.indicators || ""}</td>
        <td colspan="2">${item.suggestions || ""}</td>
      </tr>
    `;

    const rowsHtml = data
      .map(
        (item, index) => `
          ${index > 0 ? renderHeaderRow() : ""}
          ${renderMainRow(item, index)}
          ${renderNestedRows(item)}
        `
      )
      .join("");

    const html = `
  <!DOCTYPE html>
  <html dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <title>طباعة التقرير</title>
  
    <style>
      body {
        font-family: Cairo, sans-serif;
        margin-top: 160px; /* مساحة للهيدر المتكرر */
      }
  
      /* ===== HEADER ===== */
      .print-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
      }
  
      .header-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
  
      .header-left {
        text-align: center;
      }
  
      /* ===== TABLE ===== */
      table {
        width: 100%;
        border-collapse: collapse;
      }
  
      th, td {
        border: 1px solid #000;
        padding: 6px;
        font-size: 12px;
        vertical-align: top;
        text-align: right;
      }
  
      th {
        background: #f3f4f6;
        font-weight: bold;
      }
  
      tr {
        page-break-inside: avoid;
      }
  
      .nested-header td {
        background: #eee;
        font-weight: bold;
        text-align: center;
      }
  
      .images img {
        width: 45px;
        height: 45px;
        object-fit: cover;
        margin: 2px;
      }
  
      @page {
        size: A4 landscape;
        margin: 15mm;
      }
    </style>
  </head>
  
  <body>
  
    <!-- ===== HEADER (يتكرر في كل صفحة) ===== -->
    <div class="print-header">
      <div class="header-inner">
        <div class="header-left">
          <img src="../ksa.png" height="60" />
          <p>وزارة التعليم</p>
          <p>الإدارة العامة للتعليم بمنطقة مكة المكرمة</p>
        </div>

        <div>
        <h2 style="text-align:center;">مقدم خدمات دعم التميز المدرسي</h2>
      <h3 style="text-align:center; margin-bottom:10px;">
        أ. منى غالي غانم الصاعدي
      </h3>
      </div>

        <img src="../taleem.png" height="100" />
        
      </div>
  
      
    </div>
  
    <!-- ===== TABLE ===== -->
    <table>
      <thead>
        ${renderHeaderRow()}
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  
  </body>
  </html>
    `;

    const win = window.open("", "", "width=1200,height=800");
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
      win.close();
    };
  });

  // تصدير إلى Excel
  exportBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("employeeData") || "[]");

    let csv =
      "م,التاريخ,اسم المدرسة,المجال الإشرافي,أسلوب التنفيذ,نوعه,عدد صور الباركود,الأهداف,المؤشرات,التوصيات\n";

    const clean = (v) =>
      `"${(v || "").toString().replace(/"/g, '""')}"`;

    data.forEach((item, index) => {
      csv += [
        index + 1,
        clean(`${daysDayByIndex(item.day)} ${item.date}`),
        clean(item.name),
        clean(findSelectedScope(item.job)),
        clean(item.details),
        clean(findSelectedType(item.category)),
        clean(item.barcodeImage?.length || 0),
        clean(item.objectives),
        clean(item.indicators),
        clean(item.suggestions),
      ].join(",") + "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "جدول_إنجاز_الموظفات.csv";
    link.click();
    URL.revokeObjectURL(link.href);
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
