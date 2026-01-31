
import React from 'react';
import { ReportData } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReportData | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#2a173a] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-10">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold text-white">{data.title}</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors text-4xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">الملخص التنفيذي</h3>
            <p className="text-lg text-white/80 leading-relaxed">{data.summary}</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">مقاييس الأداء</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.metrics.map((m, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-white/60 text-sm mb-1">{m.label}</div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-black">{m.value}%</span>
                    <span className={`text-sm font-bold ${
                      m.trend === 'up' ? 'text-green-400' : 
                      m.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {m.trend === 'up' ? '↑ تحسن' : m.trend === 'down' ? '↓ تراجع' : '↔ مستقر'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">التوصيات الاستراتيجية</h3>
            <ul className="space-y-3">
              {data.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-lg">
                  <span className="w-6 h-6 flex-shrink-0 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                  <span className="text-white/90">{rec}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-10 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-10 py-3 rounded-xl transition-colors"
          >
            إغلاق التقرير
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
