"use client";
import React, { useState, useRef } from "react";
import { AchievementRecord, AchievementDetail } from "../types";
import { scopeJson, methodJson } from "../data/selectData";
import { DAYS_OF_WEEK, HIJRI_MONTHS } from "@/data/hijriDate";

interface ExtendedDetail extends AchievementDetail {
  isCustomDomain?: boolean;
  isCustomKpi?: boolean;
}

interface AchievementFormProps {
  onAdd: (record: AchievementRecord) => void;
  onFix: (e: any) => void;
  onBack: () => void;
  onPreviewImage: (url: string) => void;
}

const AchievementForm: React.FC<AchievementFormProps> = ({
  onAdd,
  onFix,
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
    day: "",
    stage: "",
    school: "",
    status: "",
  });

  const [hijriDate, setHijriDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [details, setDetails] = useState<ExtendedDetail[]>([
    {
      domain: "",
      kpi: "",
      procedure: "",
      isCustomDomain: false,
      isCustomKpi: false,
    },
  ]);

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

  const addDetailRow = () => {
    setDetails([
      ...details,
      {
        domain: "",
        kpi: "",
        procedure: "",
        isCustomDomain: false,
        isCustomKpi: false,
      },
    ]);
  };

  const removeDetailRow = (index: number) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const updateDetail = (
    index: number,
    field: keyof ExtendedDetail,
    value: any,
  ) => {
    const newDetails = [...details];
    (newDetails[index] as any)[field] = value;

    // Auto-switch to custom mode if "أخرى" is selected
    if (field === "domain" && value === "أخرى") {
      newDetails[index].isCustomDomain = true;
      newDetails[index].domain = "";
    }
    if (field === "kpi" && value === "أخرى") {
      newDetails[index].isCustomKpi = true;
      newDetails[index].kpi = "";
    }

    // Reset KPI if domain changes and not in custom KPI mode
    if (field === "domain" && !newDetails[index].isCustomKpi) {
      newDetails[index].kpi = "";
    }
    setDetails(newDetails);
  };

  const isRowComplete = (row: AchievementDetail) =>
    row.domain && row.kpi && row.procedure;
  const isDetailsValid = details.some(isRowComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);

    const isBasicValid =
      // formData.supervisor &&
      formData.day &&
      hijriDate.day &&
      hijriDate.month &&
      formData.stage &&
      formData.school &&
      formData.status;

    if (!isBasicValid || !isDetailsValid) {
      return;
    }

    if (window.confirm(`هل أنت متأكد من حفظ هذا السجل وإضافته؟`)) {
      alert("تم إضافةالبيانات بنجاح");
    }

    const formattedDate = `${hijriDate.day} ${hijriDate.month} ${hijriDate.year}`;

    // Strip UI-only properties before adding
    const cleanDetails: AchievementDetail[] = details
      .filter(isRowComplete)
      .map(({ domain, kpi, procedure }) => ({ domain, kpi, procedure }));

    onAdd({
      id: Date.now(),
      // semester: formData.semester,
      // team: formData.team,
      // supervisor: formData.supervisor,
      day: formData.day,
      date: formattedDate,
      school: formData.school,
      stage: formData.stage,
      status: formData.status,
      details: cleanDetails,
      witness: images,
    });

    // Reset only variable fields: images, details, and status
    setImages([]);
    setDetails([
      {
        domain: "",
        kpi: "",
        procedure: "",
        isCustomDomain: false,
        isCustomKpi: false,
      },
    ]);
    setFormData((prev) => ({ ...prev, status: "" }));
    setTriedSubmit(false);
  };

  const handleSubmitFixed = (e) => {
    e.preventDefault();
    setTriedSubmitFixed(true);

    const isValid =
      formFixedData.supervisor && formFixedData.team && formFixedData.semester;

    if (!isValid || !isValid) {
      return;
    }

    alert("تم تثبيت البيانات بنجاح");

    onFix({
      supervisor: formFixedData.supervisor,
      team: formFixedData.team,
      semester: formFixedData.semester,
    });
    setTriedSubmitFixed(false);
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
                setFormData({ ...formData, stage: e.target.value })
              }
              className={getInputClasses(formData.stage)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.stage && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold">المجال الإشرافي</label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              className={getInputClasses(formData.stage)}
            >
              <option value="">اختر المجال</option>
              <option value="1">نواتج التعلم</option>
              <option value="2">الأنشطة المدرسية</option>
              <option value="3">التوجيه الطلابي</option>
              <option value="4">التطوير المستمر</option>
              <option value="5">التدريس</option>
            </select>
            {triedSubmit && !formData.stage && (
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
              setFormData({ ...formData, stage: e.target.value })
            }
            className={`${getInputClasses(formData.stage)} border w-[50%]`}
            placeholder="اكتب المؤشر هنا..."
            autoFocus
          />

          {triedSubmit && !formData.day && (
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
                setFormData({ ...formData, stage: e.target.value })
              }
              className={getInputClasses(formData.stage)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.day && (
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
                setFormData({ ...formData, stage: e.target.value })
              }
              className={getInputClasses(formData.stage)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.day && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">عدده</label>

            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              className={getInputClasses(formData.stage)}
              // placeholder="اكتب المؤشر هنا..."
              autoFocus
            />

            {triedSubmit && !formData.day && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold">نوعه</label>
            <select
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              className={getInputClasses(formData.stage)}
            >
              <option value="">اختر النوع</option>
              <option value="طفولة مبكرة">طفولة مبكرة</option>
              <option value="ابتدائي">ابتدائي</option>
              <option value="متوسط">متوسط</option>
              <option value="ثانوي">ثانوي</option>
            </select>
            {triedSubmit && !formData.stage && (
              <p className="text-[10px] text-red-500 font-bold">
                هذا الحقل مطلوب
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-bold mb-2">
              الأهداق التفصيلية للأسلوب الإشرافي
            </label>

            <textarea
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              className={`${getInputClasses(formData.stage)} border w-[50%]`}
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
                setFormData({ ...formData, stage: e.target.value })
              }
              className={`${getInputClasses(formData.stage)} border w-[50%]`}
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
                setFormData({ ...formData, stage: e.target.value })
              }
              className={`${getInputClasses(formData.stage)} border w-[50%]`}
              placeholder="اكتب المؤشر هنا..."
              autoFocus
            />
          </div>
        </div>

        {/* Upload Area */}
        <div className="flex flex-col items-center gap-6 py-6 border-t border-gray-100">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-md:max-w-xs w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 group"
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
