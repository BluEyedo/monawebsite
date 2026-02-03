"use client";
import React, { useState, useRef } from "react";
import { AchievementRecord, AchievementDetail } from "../types";
import { HIJRI_MONTHS } from "@/data/hijriDate";

interface ExtendedDetail extends AchievementDetail {
  isCustomDomain?: boolean;
  isCustomKpi?: boolean;
}

interface AchievementFormProps {
  onAdd: (record: AchievementRecord) => void;
  // onFix: (e: any) => void;
  onBack: () => void;
  onPreviewImage: (url: string) => void;
}

const AchievementForm: React.FC<AchievementFormProps> = ({
  onAdd,
  // onFix,
  onBack,
  onPreviewImage,
}) => {
  const [formFixedData, setFormFixedData] = useState({
    team: "بحرة",
    supervisor: "",
    semester: "الفصل الأول",
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    var fixedData = localStorage.getItem("fixedData");
    if (fixedData) {
      const parsedData = JSON.parse(fixedData);
      setFormFixedData(parsedData);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    job: "",
    benefited: "",
    amount: "",
    day: "",
    date: "",
    category: "",
    details: "",
    objectives: "",
    indicators: "",
    suggestions: "",
    barcodeImage: "",
  });

  const [hijriDate, setHijriDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [triedSubmitFixed, setTriedSubmitFixed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isRowComplete = (row: AchievementDetail) =>
    row.domain && row.kpi && row.procedure;
  // const isDetailsValid = details.some(isRowComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);

    const isBasicValid =
      formData.name &&
      formData.job &&
      formData.benefited &&
      formData.amount &&
      hijriDate.day &&
      hijriDate.month &&
      hijriDate.year &&
      formData.category &&
      formData.details &&
      formData.objectives &&
      formData.indicators &&
      formData.suggestions;

    console.log(
      `name: ${formData.name},`,
      `job: ${formData.job},`,
      `benefited: ${formData.benefited},`,
      `amount: ${formData.amount},`,
      `date: ${formData.date},`,
      `day: ${hijriDate.day},`,
      `month: ${hijriDate.month},`,
      `year: ${hijriDate.year},`,
      `category: ${formData.category},`,
      `details: ${formData.details},`,
      `objectives: ${formData.objectives},`,
      `indicators: ${formData.indicators},`,
      `suggestions: ${formData.suggestions},`,
      `barcodeImage: ${formData.barcodeImage},`,
    );

    if (!isBasicValid) {
      return;
    }

    if (window.confirm(`هل أنت متأكد من حفظ هذا السجل وإضافته؟`)) {
      alert("تم إضافةالبيانات بنجاح");
    }

    const formattedDate = `${hijriDate.day} ${hijriDate.month} ${hijriDate.year}`;

    // Strip UI-only properties before adding
    onAdd({
      id: Date.now(),
      name: formData.name,
      job: formData.job,
      benefited: formData.benefited,
      amount: formData.amount,
      date: formattedDate,
      category: formData.category,
      details: formData.details,
      objectives: formData.objectives,
      indicators: formData.indicators,
      suggestions: formData.suggestions,
      barcodeImage: images,
    });

    // Reset only variable fields: images, details, and status
    setImages([]);

    var inputs = window.document.querySelectorAll("input");
    var selects = window.document.querySelectorAll("select");
    var textarea = window.document.querySelectorAll("textarea");

    inputs.forEach((element) => {
      element.value = "";
    });
    textarea.forEach((element) => {
      element.value = "";
    });
    selects.forEach((element) => {
      element.selectedIndex = 0;
    });

    setFormData({
      name: "",
      job: "",
      benefited: "",
      amount: "",
      day: "",
      date: "",
      category: "",
      details: "",
      objectives: "",
      indicators: "",
      suggestions: "",
      barcodeImage: "",
    });

    setTriedSubmit(false);
  };

  const getInputClasses = (value: any) => {
    const base =
      "w-full border-b outline-none py-1 text-right bg-transparent transition-colors ";
    const error = "border-red-500 bg-red-50/50";
    const normal = "border-gray-300 focus:border-blue-500";
    return base + (triedSubmit && !value ? error : normal);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden text-gray-800 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-10">
        <div className="flex-1 text-center">
          <h1 className="text-lg md:text-2xl font-bold border-black inline-block pb-1">
            نموذج توثيق برنامج
          </h1>
        </div>
        <button
          onClick={onBack}
          className="border border-blue-500 text-blue-500 px-4 py-1 rounded-md text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 no-print"
        >
          <span>الرئيسية</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">اسم المدرسة</label>

            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={getInputClasses(formData.name)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.name && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold">المجال الإشرافي</label>
            <select
              value={formData.job}
              onChange={(e) =>
                setFormData({ ...formData, job: e.target.value })
              }
              className={getInputClasses(formData.job)}
            >
              <option value="">اختر المجال</option>
              <option value="1">نواتج التعلم</option>
              <option value="2">الأنشطة المدرسية</option>
              <option value="3">التوجيه الطلابي</option>
              <option value="4">التطوير المستمر</option>
              <option value="5">التدريس</option>
            </select>
            {triedSubmit && !formData.job && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold mb-2">اسلوب التنفيذ</label>

          <textarea
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className={`${getInputClasses(formData.details)} border w-[50%]`}
            placeholder="اكتب المؤشر هنا..."
            autoFocus
          />

          {triedSubmit && !formData.details && (
            <p className="text-[10px] text-red-500 font-bold">
              هذا الحقل مطلوب
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">اسم البرنامج</label>

            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, program: e.target.value })
              }
              className={getInputClasses(formData.program)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.program && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">
              الفئة المستفيدة
            </label>

            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, benefited: e.target.value })
              }
              className={getInputClasses(formData.benefited)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.benefited && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">عدده</label>

            <input
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={getInputClasses(formData.amount)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.amount && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold">نوعه</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={getInputClasses(formData.category)}
            >
              <option value="">اختر النوع</option>
              <option value="1">حضوري</option>
              <option value="2">عن بعد</option>
            </select>
            {triedSubmit && !formData.category && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>
        </div>

        <div className="">
          <label className="block text-sm font-bold">التاريخ (هجري)</label>
          <div className="flex gap-5">
            <select
              value={hijriDate.day}
              onChange={(e) =>
                setHijriDate({ ...hijriDate, day: e.target.value })
              }
              className={getInputClasses(hijriDate.day)}
            >
              <option value="">اليوم</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={hijriDate.month}
              onChange={(e) =>
                setHijriDate({ ...hijriDate, month: e.target.value })
              }
              className={getInputClasses(hijriDate.month)}
            >
              <option value="">الشهر</option>
              {HIJRI_MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={hijriDate.year}
              onChange={(e) =>
                setHijriDate({ ...hijriDate, year: e.target.value })
              }
              className={getInputClasses(hijriDate.year)}
            >
              <option value="">السنة</option>
              {Array.from({ length: 31 }, (_, i) => 1430 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {triedSubmit && (!hijriDate.day || !hijriDate.month) && (
            <p className="text-[10px] text-red-500 font-bold">التاريخ مطلوب</p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">
              الأهداف التفصيلية للأسلوب الإشرافي
            </label>

            <textarea
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, objectives: e.target.value })
              }
              className={`${getInputClasses(formData.objectives)} border w-[50%]`}
              placeholder="اكتب المؤشر هنا..."
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">
              المؤشرات الدالة على تحقق المستهدفات (مخرجات قابلة للقياس)
            </label>

            <textarea
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, indicators: e.target.value })
              }
              className={`${getInputClasses(formData.indicators)} border w-[50%]`}
              placeholder="اكتب المؤشر هنا..."
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">
              توصيات عامة لتحسين الممارسات أو استدامة الأثر
            </label>

            <textarea
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, suggestions: e.target.value })
              }
              className={`${getInputClasses(formData.suggestions)} border w-[50%]`}
              placeholder="اكتب المؤشر هنا..."
              autoFocus
            />
          </div>
        </div>

        {/* Upload Area */}
        <div className="flex flex-col items-center gap-6 py-6 border-t border-gray-100">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-md:max-w-xs max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 group"
          >
            <div className="mb-2 text-gray-400 group-hover:text-blue-500 transition-colors">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 font-bold">
              ارفق صور الشواهد بالضغط هنا او سحب الصور إلى هنا
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          {images.length > 0 && (
            <div className="w-full max-w-4xl grid grid-cols-4 md:grid-cols-8 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={img}
                    alt="upload"
                    className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm cursor-zoom-in group-hover:brightness-75 transition-all"
                    onClick={() => onPreviewImage(img)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md hover:bg-red-600 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-4 px-24 rounded-2xl shadow-xl transition-all active:scale-95 transform hover:-translate-y-1"
          >
            إضافة البيانات
          </button>
        </div>
      </form>
    </div>
  );
};

export default AchievementForm;
