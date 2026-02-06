import React from "react";

interface DetailRecord {
  domain: string;
  kpi: string;
  procedure: string;
}

interface AchievementRecord {
  day: string;
  date: string;
  school: string;
  stage: string;
  status: string;
  witness: string[];
  details: DetailRecord[];
}

interface FixedData {
  team?: string;
  supervisor?: string;
  semester?: string;
}

interface PrintReportProps {
  records: AchievementRecord[];
  fixedData: FixedData;
}

const PrintReport: React.FC<PrintReportProps> = ({ records, fixedData }) => {
  if (records.length === 0) {
    return (
      <div className="hidden print:block p-8 text-center text-gray-600">
        <p className="text-xl">لا توجد سجلات للطباعة</p>
      </div>
    );
  }

  const RECORDS_PER_PAGE = 4;

  const HeaderRow = () => (
    <tr className="bg-gray-200 font-bold text-xs">
      <th className="border border-black p-2 w-5">م</th>
      <th className="border border-black p-2 w-24">التاريخ</th>
      <th className="border border-black p-2 w-24"> اسم المدرسة</th>
      <th className="border border-black p-2 w-72">المجال الإشرافي</th>
      <th className="border border-black p-2 w-24">أسلوب التنفيذي</th>
      <th className="border border-black p-2 w-24">نوعه</th>
      <th className="border border-black p-2 w-40">صور الباركود</th>
    </tr>
  );

  const DetailsHeaderRow = () => (
    <>
      <tr className="bg-gray-200 font-bold text-xs">
        <td colSpan={3} className="border border-black p-2">
          الأهداف التفصيلية للأسلوب الإشرافي
        </td>
        <td colSpan={2} className="border border-black p-2">
          المؤشرات الدالة على تحقق المستهدفات (مخرجات قابلة للقياس )
        </td>
        <td colSpan={3} className="border border-black p-2">
          توصيات عامة لتحسين الممارسات أو استدامة الأثر
        </td>
      </tr>
    </>
  );

  const PrintHeader = () => (
    <div className=" mb-4">
      {/* Header Image */}
      <div className="mb-3">
        <img
          className="w-full h-auto object-contain"
          src="header.png"
          alt="ترويسة التقرير"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      {/* Fixed Data Table */}
      {/* <div className="px-10 ">
        <table className="w-full text-sm border-collapse ">
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th colSpan={2} className="border-t border-black p-2 text-center">
                البيانات الأولية
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-y border-black p-2 bg-gray-200 font-bold w-48">
                الفريق
              </td>
              <td className="border-y border-black p-2">
                {fixedData?.team || "—"}
              </td>
            </tr>
            <tr>
              <td className="border-y border-black p-2 bg-gray-200 font-bold">
                إسم المشرفة
              </td>
              <td className="border-y border-black p-2">
                {fixedData?.supervisor || "—"}
              </td>
            </tr>
            <tr>
              <td className="border-y border-black p-2 bg-gray-200 font-bold">
                الفصل الدراسي
              </td>
              <td className="border-b border-black p-2">
                {fixedData?.semester || "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );

  const renderRecordContent = (rec: any, index: number) => (
    <React.Fragment key={`record-${index}`}>
      {/* Record Header */}
      <HeaderRow />

      {/* Main Record Row */}
      <tr>
        <td className=" p-2 text-center font-bold bg-gray-50">{index + 1}</td>
        <td className=" p-2">{rec.date}</td>
        <td className=" p-2">{rec.name}</td>
        <td className=" p-2">
          {rec?.job == "1"
            ? "عن نواتج التعلم"
            : rec?.job
              ? "الأنشطة المدرسية"
              : rec?.job
                ? "التوجيه الطلابي"
                : rec?.job
                  ? "التطوير المستمر"
                  : "التدريس"}
        </td>
        <td className=" p-2">{rec.details}</td>
        <td className=" p-2 text-center font-bold">
          {" "}
          {rec?.category == "1" ? "حضوري" : "عن بعد"}
        </td>
        <td className="text-black px-2 py-4 border-l border-gray-200 flex">
          {rec.barcodeImage.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="barcodeImage"
              className="w-10 h-10 object-cover rounded border border-gray-400 cursor-zoom-in hover:scale-125 transition-transform shadow-sm"
              // onClick={() => onPreviewImage(img)}
            />
          ))}
          {rec.barcodeImage.length === 0 && (
            <span className="text-gray-400 text-[10px]">لا يوجد</span>
          )}
        </td>
      </tr>

      {/* Details Section */}
      <DetailsHeaderRow />

      <tr className="font-bold text-xs">
        <td colSpan={3} className="border border-black p-2">
          {rec?.indicators}
        </td>
        <td colSpan={2} className="border border-black p-2">
          {rec?.objectives}
        </td>
        <td colSpan={3} className=" p-2">
          {rec?.suggestions}
        </td>
      </tr>
    </React.Fragment>
  );

  const renderPages = () => {
    const pages = [];

    // Group records into pages
    for (let i = 0; i < records.length; i += RECORDS_PER_PAGE) {
      const pageRecords = records.slice(i, i + RECORDS_PER_PAGE);
      const pageNumber = Math.floor(i / RECORDS_PER_PAGE);

      pages.push(
        <div
          key={`page-${pageNumber}`}
          className={pageNumber > 0 ? "page-break-before" : ""}
        >
          {/* Print header for each page */}
          <PrintHeader />

          {/* Records table for this page */}
          <div className="px-10">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {pageRecords.map((rec, pageIndex) => {
                  const globalIndex = i + pageIndex;
                  return renderRecordContent(rec, globalIndex);
                })}
              </tbody>
            </table>
          </div>
        </div>,
      );
    }

    return pages;
  };

  return (
    <>
      <style>{`
        @media print {
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>
      <div className="hidden print:block">{renderPages()}</div>
    </>
  );
};

export default PrintReport;
