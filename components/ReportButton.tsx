import React from "react";
import { LuClipboardCheck } from "react-icons/lu";

interface ReportButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const ReportButton: React.FC<ReportButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative group flex flex-col items-center justify-center
        h-[150px] sm:h-auto
        w-full max-w-md aspect-[16/9] md:aspect-[21/9]
        bg-gradient-to-b from-[#A054F3] to-[#3A44BD]
        rounded-xl shadow-[0_0_40px_rgba(160,84,243,0.4)]
        hover:shadow-[0_0_60px_rgba(160,84,243,0.6)]
        active:scale-95 transition-all duration-300
        border-t border-white/20
        overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {isLoading ? (
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-xl font-bold">جاري تحضير التقرير الذكي...</span>
        </div>
      ) : (
        <>
          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 scale-75 sm:scale-100">
            <LuClipboardCheck size={55} color="#FACC15" />
          </div>
          <span className=" sm:text-xl font-black text-center px-8 leading-tight drop-shadow-md">
            تقرير إنجاز مقدم خدمات دعم التميز المدرسي
          </span>
        </>
      )}
    </button>
  );
};

export default ReportButton;
