// tableActions.js
document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("printBtn");
  const exportBtn = document.getElementById("excelBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  // طباعة الجدول
  printBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("excellenceReport") || "[]");


    let html = `
      <html dir="rtl">
        <head>
          <title>_</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
          
          @media print {
            @page {
              size: landscape;
            }
          }

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
                  <th class="text-xs text-center">م</th>
                  <th class="text-xs text-center w-[60px]">الفريق التنفيذي</th>
                  <th class="text-xs text-center">اسم المشرفة</th>
                  <th class="text-xs text-center">المرحلة</th>
                  <th class="text-xs text-center">المدرسة</th>
                  <th class="text-xs text-center">الفصل الدراسي</th>
                  <th class="text-xs text-center">المجال</th>
                  <th class="text-xs text-center w-[200px]">مؤشر الأداء</th>
                  <th class="text-xs text-center w-[130px]">الإجراءات والأساليب المنفذة</th>
                  <th class="border px-4 py-2 w-[80px]">حالة الإنجاز</th>
                </tr>
              </thead>
              <tbody>
                ${data
        .map(
          (item, index) => {
            var scope = scopeJson.find(f => f.scopeId == item.scope);
            var pointer = scope.pointer.find(f => f.pointerId == item.pointer);

            return `
                  <tr>
                  <td class="text-xs">${index + 1}</td>
                  <td class="text-xs">${item.team}</td>
                  <td class="text-xs">${item.advisorName}</td>
                  <td class="text-xs">
                    ${item.stage == "1" ? "طفولة مبكرة" : ""}
                    ${item.stage == "2" ? "ابتدائي" : ""}
                    ${item.stage == "3" ? "متوسط" : ""}
                    ${item.stage == "4" ? "ثانوي" : ""}
                    </td>
                  <td class="text-xs">${item.school}</td>
                  <td class="text-xs text-center">${item.term == "1" ? "الفصل الأول" : "الفصل الثاني"}</td>
                  <td class="text-xs text-center">${scope?.label}</td>
                  <td class="border px-4 py-2 text-start ">${item.pointer.map((p, i) => {
              if (p == "add") {
                return `<p>${i + 1}. ${item.newPointer}</p>`;
              } else {
                var pointer = scope.pointer.find(f => f.pointerId == p);
                return `<p>${i + 1}. ${pointer.label}</p>`;
              }
            }).join("")}</td>
            <td class="border px-4 py-2 text-start">
            ${item.method.map((m, i) => {
              if (m == "add") {
                return `<p>${i + 1}. ${item.newMethod}</p>`;
              } else {
                var method = methodJson.find(f => f.methodId == m);

                return `<p>${i + 1}. ${method.label}</p>`;
              }
            }).join("")}
          </td>
                    <td class="">${item.category == "1" ? "تم الإنجاز" : "لم يتم الإنجاز"}</td>
                  </tr >
      `}
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
    const data = JSON.parse(localStorage.getItem("excellenceReport") || "[]");


    let csv =
      `م,الفريق التنفيذي,اسم المشرفة,المرحلة,المدرسة,الفصل الدراسي,المجال,مؤشر الأداء,الإجراءات والأساليب المنفذة،حالة الإنجاز\n`;


    data.forEach((item, index) => {
      const clean = (str) => `"${(str || "").toString().replace(/"/g, '""')}"`;
      var scope = scopeJson.find(f => f.scopeId == item.scope);
      var pointer = scope.pointer.find(f => f.pointerId == item.pointer);

      csv +=
        [
          index + 1,
          clean(item.team),
          clean(item.advisorName),
          clean(item.stage == "1" ? "طفولة مبكرة" : item.stage == "2" ? "ابتدائي" : item.stage == "3" ? "متوسط" : "ثانوي"),
          clean(item.school),
          clean(item.term == "1" ? "الفصل الأول" : "الفصل الثاني"),
          clean(scope?.label),
          clean(
            Array.isArray(item.pointer)
              ? item.pointer
                .map((p) => {
                  if (p === "add") return item.newPointer;
                  const pointerObj = scope.pointer.find((f) => f.pointerId == p);
                  return pointerObj ? pointerObj.label : "";
                })
                .join(" / ") // use slash or comma between them
              : item.pointer === "add"
                ? item.newPointer
                : (scope.pointer.find((f) => f.pointerId == item.pointer) || {}).label || ""
          ),
          clean(
            Array.isArray(item.pointer)
              ? item.method
                .map((p) => {
                  if (p === "add") return item.newPointer;
                  const methodObj = methodJson.find((f) => f.methodId == p);
                  return methodObj ? methodObj.label : "";
                })
                .join(" / ") // use slash or comma between them
              : item.method === "add"
                ? item.newMethod
                : (methodJson.find((f) => f.methodId == item.method) || {}).label || ""
          ),
          // clean(
          //   item.stage == "1" ? "اجتماع" :
          //     item.stage == "2" ? "حلقة نقاش" :
          //       item.stage == "3" ? "لقاء" :
          //         item.stage == "4" ? "ورش عمل" :
          //           item.stage == "5" ? "مجتمع تعلم مهني" :
          //             item.method == "6" ? "برنامج" : item.method == "7" ? "تقرير" : `${item.method == "add" ? item.newMethod : ""}`),
          clean(item.category == "1" ? "تم الإنجاز" : "لم يتم الإنجاز"),
        ].join(",") + "\n";
    });

    // إضافة BOM في بداية CSV لحل مشكلة العربية
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "تقرير_إنجاز_مقدم_خدمات_دعم_التميز_المدرسي.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  // حذف كامل البيانات
  deleteBtn.addEventListener("click", () => {
    if (confirm("هل أنت متأكد من حذف جميع البيانات؟")) {
      localStorage.removeItem("excellenceReport");
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
