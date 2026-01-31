import React from "react";
import { AchievementRecord } from "../types";

interface AchievementTableProps {
  records: AchievementRecord[];
  onDeleteAll: () => void;
  onDeleteOne: (id: number) => void;
  onPreviewImage: (url: string) => void;
}

const AchievementTable: React.FC<AchievementTableProps> = ({
  records,
  onDeleteAll,
  onDeleteOne,
  onPreviewImage,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert("لا توجد بيانات لتصديرها");
      return;
    }

    // CSV Headers based on Print Page columns + Details
    const headers = [
      "م",
      "الفصل الدراسي",
      "الفريق التنفيذي",
      "اسم المشرفة",
      "اليوم",
      "التاريخ",
      "المدرسة",
      "المرحلة",
      "حالة الإنجاز",
      "المجال",
      "مؤشر الأداء",
      "الإجراءات والأساليب",
      "عدد الشواهد",
    ];

    // Create CSV rows by flattening records and their details
    const csvRows: string[][] = [];

    records.forEach((rec, recIdx) => {
      rec.details.forEach((detail, detIdx) => {
        csvRows.push([
          (recIdx + 1).toString(),
          rec.semester,
          rec.team,
          rec.supervisor,
          rec.day,
          rec.date,
          rec.school,
          rec.stage,
          rec.status,
          detail.domain,
          detail.kpi,
          detail.procedure,
          detIdx === 0 ? rec.witness.length.toString() : "", // Only show witness count on the first detail row of a record
        ]);
      });
    });

    // Format for CSV content
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...csvRows.map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Unicode BOM for proper Arabic display in Excel
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `تقرير_التميز_المدرسي_${new Date()
        .toLocaleDateString("ar-SA")
        .replace(/\//g, "-")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedCount = records.filter(
    (r) => r.status === "تم الإنجاز"
  ).length;
  const incompleteCount = records.filter(
    (r) => r.status === "لم يتم الإنجاز"
  ).length;

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-gray-800 print:hidden overflow-visible">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold inline-block border-black pb-1">
          جدول إنجاز مقدم خدمات دعم التميز المدرسي
        </h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        {/* Right Side: Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={handlePrint}
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
            </svg>
            طباعة التقرير
          </button>
          {/* <button
            onClick={handleExportCSV}
            className="bg-[#0891b2] hover:bg-[#0e7490] text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M8 13h8M8 17h8M10 9H8" />
            </svg>
            تصدير إلى Excel
          </button> */}
          <button
            onClick={onDeleteAll}
            className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
            </svg>
            حذف كافة البيانات
          </button>
        </div>

        {/* Left Side: Statistics */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center bg-green-50 border border-green-200 px-4 py-1 rounded-xl">
            <span className="text-[10px] font-black text-green-600 uppercase">
              المنجزة
            </span>
            <span className="text-xl font-black text-green-700 leading-tight">
              {completedCount}
            </span>
          </div>
          <div className="flex flex-col items-center bg-red-50 border border-red-200 px-4 py-1 rounded-xl">
            <span className="text-[10px] font-black text-red-600 uppercase">
              غير المنجزة
            </span>
            <span className="text-xl font-black text-red-700 leading-tight">
              {incompleteCount}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-right border-collapse table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-[11px] font-black uppercase text-gray-700 border-b border-gray-300">
              <th className="px-2 py-3 border-l border-gray-300 w-10">م</th>
              <th className="px-2 py-3 border-l border-gray-300">الفصل</th>
              <th className="px-2 py-3 border-l border-gray-300">الفريق</th>
              <th className="px-2 py-3 border-l border-gray-300">المشرفة</th>
              <th className="px-2 py-3 border-l border-gray-300">اليوم</th>
              <th className="px-2 py-3 border-l border-gray-300">التاريخ</th>
              <th className="px-2 py-3 border-l border-gray-300">المدرسة</th>
              <th className="px-2 py-3 border-l border-gray-300">المرحلة</th>
              <th className="px-2 py-3 border-l border-gray-300">
                حالة الإنجاز
              </th>
              <th className="px-2 py-3 border-l border-gray-300">الشاهد</th>
              <th className="px-2 py-3">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-16 text-center text-gray-400 italic font-bold"
                >
                  لا توجد بيانات مسجلة في التقرير حالياً
                </td>
              </tr>
            ) : (
              records.map((rec, index) => (
                <React.Fragment key={rec.id}>
                  {index > 0 && (
                    <tr className="bg-gray-100 text-[11px] font-black uppercase text-gray-700 border-b border-gray-300">
                      <th className="px-2 py-3 border-l border-gray-300 w-10">
                        م
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        الفصل
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        الفريق
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        المشرفة
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        اليوم
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        التاريخ
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        المدرسة
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        المرحلة
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        حالة الإنجاز
                      </th>
                      <th className="px-2 py-3 border-l border-gray-300">
                        الشاهد
                      </th>
                      <th className="px-2 py-3">إجراء</th>
                    </tr>
                  )}

                  {/* Main Info Row */}
                  <tr className="bg-white border-b border-gray-200 text-[12px] transition-colors hover:bg-gray-50/50">
                    <td className="text-black px-2 py-4 border-l border-gray-200 font-black text-center">
                      {index + 1}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200">
                      {rec.semester}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200 font-black text-blue-700">
                      {rec.team}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200 font-bold">
                      {rec.supervisor}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200">
                      {rec.day}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200 whitespace-nowrap font-medium">
                      {rec.date}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200">
                      {rec.school}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200">
                      {rec.stage}
                    </td>
                    <td className="text-black px-2 py-4 border-l border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-black text-[9px] ${
                            rec.status === "تم الإنجاز"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {rec.status}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full shadow-inner ${
                            rec.status === "تم الإنجاز"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </td>
                    <td className="px-2 py-4 border-l border-gray-200">
                      <div className="flex gap-1 flex-wrap justify-center">
                        {rec.witness.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="witness"
                            className="w-10 h-10 object-cover rounded border border-gray-400 cursor-zoom-in hover:scale-125 transition-transform shadow-sm"
                            onClick={() => onPreviewImage(img)}
                          />
                        ))}
                        {rec.witness.length === 0 && (
                          <span className="text-gray-400 text-[10px]">
                            لا يوجد
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <button
                        onClick={() => onDeleteOne(rec.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all"
                        title="حذف هذا السجل"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  {/* Nested Details Row */}
                  <tr className="border-b-2 border-gray-300">
                    <td colSpan={11} className="p-0">
                      <table className="w-full text-right bg-gray-50/50">
                        <thead>
                          <tr className="bg-gray-100/80 text-[10px] font-black text-gray-700 border-y border-gray-200">
                            <th className="px-4 py-2 border-l border-gray-200 w-1/4">
                              المجال
                            </th>
                            <th className="px-4 py-2 border-l border-gray-200 w-1/2">
                              مؤشر الأداء
                            </th>
                            <th className="px-4 py-2">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rec.details.map((detail, dIdx) => (
                            <tr
                              key={dIdx}
                              className="border-b border-gray-100 last:border-0"
                            >
                              <td className="px-4 py-3 border-l border-gray-200 text-[11px] font-bold text-gray-800">
                                {dIdx + 1}. {detail.domain}
                              </td>
                              <td className="px-4 py-3 border-l border-gray-200 text-[11px] text-gray-700 leading-relaxed">
                                {dIdx + 1}. {detail.kpi}
                              </td>
                              <td className="px-4 py-3 text-[11px] text-gray-700">
                                {dIdx + 1}. {detail.procedure}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="mt-6 text-xs text-gray-500 font-bold flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          إجمالي السجلات المدخلة: {records.length} سجل
        </div>
      )}
    </div>
  );
};

export default AchievementTable;
