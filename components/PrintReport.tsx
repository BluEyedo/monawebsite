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

  const RECORDS_PER_PAGE = 2;

  const HeaderRow = () => (
    <tr className="bg-gray-200 font-bold text-xs">
      <th className="border border-black p-2 w-5">م</th>
      <th className="border border-black p-2 w-24">اليوم</th>
      <th className="border border-black p-2 w-24">التاريخ</th>
      <th className="border border-black p-2 w-72">المدرسة</th>
      <th className="border border-black p-2 w-24">المرحلة</th>
      <th className="border border-black p-2 w-24">حالة الإنجاز</th>
      <th className="border border-black p-2 w-40">الشواهد</th>
    </tr>
  );

  const DetailsHeaderRow = () => (
    <tr className="bg-gray-200 font-bold text-xs">
      <td colSpan={3} className="border border-black p-2">
        المجال
      </td>
      <td colSpan={3} className="border border-black p-2">
        مؤشر الأداء
      </td>
      <td colSpan={3} className="border border-black p-2">
        الإجراءات والأساليب
      </td>
    </tr>
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
      <div className="px-10 ">
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
      </div>
    </div>
  );

  const renderRecordContent = (rec: AchievementRecord, index: number) => (
    <React.Fragment key={`record-${index}`}>
      {/* Record Header */}
      <HeaderRow />

      {/* Main Record Row */}
      <tr>
        <td className=" p-2 text-center font-bold bg-gray-50">{index + 1}</td>
        <td className=" p-2">{rec.day}</td>
        <td className=" p-2">{rec.date}</td>
        <td className=" p-2">{rec.school}</td>
        <td className=" p-2">{rec.stage}</td>
        <td className=" p-2 text-center font-bold">{rec.status}</td>
       
      </tr>

      {/* Details Section */}
      <DetailsHeaderRow />

    
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

          {/* Footer on last page only */}
          {/* {i + RECORDS_PER_PAGE >= records.length && (
            <div className="mt-8 pt-4 border-t border-gray-400 text-center text-xs text-gray-600">
              <p>
                تم إنشاء هذا التقرير في:{" "}
                {new Date().toLocaleDateString("ar-SA")}
              </p>
            </div>
          )} */}
        </div>
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
