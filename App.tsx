import React, { useState, useEffect } from "react";
import TiltedBox from "./components/TiltedBox";
import ReportButton from "./components/ReportButton";
import AchievementForm from "./components/AchievementForm";
import AchievementTable from "./components/AchievementTable";
import PrintReport from "./components/PrintReport";
import { AchievementRecord } from "./types";

const STORAGE_KEY_RECORDS = "employeeData";
const STORAGE_KEY_VIEW = "employeeView";

const App: React.FC = () => {
  // Initialize view state from localStorage to persist across refreshes
  const [view, setView] = useState<"home" | "form">(() => {
    const savedView = localStorage.getItem(STORAGE_KEY_VIEW);
    return (savedView as "home" | "form") || "home";
  });

  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<AchievementRecord[]>(() => {
    // Initialize state from localStorage if available
    const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
    return saved ? JSON.parse(saved) : [];
  });

  //
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Sync records to localStorage whenever they change
  useEffect(() => {
    console.log("")
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  }, [records]);

  // Sync current view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VIEW, view);
  }, [view]);

  const handleGenerateReport = () => {
    setView("form");
  };

  const handleAddRecord = (record: AchievementRecord) => {
    setRecords((prev) => [...prev, record]);
  };

  const handleDeleteAll = () => {
    const message =
      records.length === 1
        ? "هل أنت متأكد من حذف السجل الوحيد الموجود؟"
        : `هل أنت متأكد من حذف جميع السجلات (${records.length}) بالكامل؟`;

    if (window.confirm(`⚠️ تنبيه: ${message} لا يمكن التراجع عن هذه الخطوة.`)) {
      setRecords([]);
      alert("تم مسح البيانات بنجاح");
    }
  };

  const handleDeleteOne = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السجل المحدد؟")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  if (view === "form") {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 py-12 px-4 md:px-8 relative print:bg-white print:p-0 print:py-0">
        <div className="no-print">
          <AchievementForm
            onAdd={handleAddRecord}
            onBack={() => setView("home")}
            onPreviewImage={setPreviewImage}
            // onFix={handleModifyFixedData}
          />
        </div>

        <div className="my-12 flex justify-center w-full max-w-6xl mx-auto no-print">
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <AchievementTable
          records={records}
          onDeleteAll={handleDeleteAll}
          onDeleteOne={handleDeleteOne}
          onPreviewImage={setPreviewImage}
        />

        {/* This component is only visible when printing */}
        <PrintReport records={records} />

        {/* Global Image Preview Lightbox */}
        {previewImage && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out no-print"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              />
              <button
                className="absolute -top-12 right-0 text-white text-4xl font-light hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(null);
                }}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden grid-pattern">
      <header className="fixed top-0 left-0 w-full p-4 flex justify-center items-center z-10">
        <span className="text-xs md:text-sm font-medium tracking-wide opacity-80 border-b border-white/20 pb-1">
          البوابة التقنية المتطورة - الوصول السريع للخدمات الإدارية الرقمية
        </span>
      </header>

      <main className="flex flex-col items-center gap-16 px-6 py-20 w-full max-w-6xl z-20">
        <TiltedBox className="w-full max-w-3xl">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 md:p-20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center select-none">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              لوحة تحكم الموظفة
            </h1>
            <p className="md:text-xl text-yellow-400 font-bold tracking-widest opacity-90 drop-shadow-sm">
              الوصول السريع للخدمات الإدارية الرقمية
            </p>
          </div>
        </TiltedBox>

        <ReportButton onClick={handleGenerateReport} isLoading={isLoading} />
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 text-center space-y-2 z-10 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-xs sm:text-sm md:text-sm font-light opacity-60">
          جميع الحقوق محفوظة © 2025 - تطوير واجتهاد شخصي.
        </p>
        <p className="text-xs sm:text-sm md:text-base font-bold opacity-90">
          مقدم خدمات دعم التميز المدرسي: أ. منى غالي الصاعدي
        </p>
      </footer>

      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default App;
