import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Download } from 'lucide-react';
import type { CampusEvent } from '../types';

interface DocumentsPageProps {
  events: CampusEvent[];
  handleDownloadPdf: (ev: CampusEvent) => void;
}

export function DocumentsPage({ events, handleDownloadPdf }: DocumentsPageProps) {
  return (
    <section className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1" style={{ boxShadow: '0px 0px 10px #999999' }}>
      <h1 className="text-3xl font-bold text-black mb-2">Мои документы и освобождения от учебы</h1>
      <p className="text-gray-600 mb-6">Автоматическая генерация справок-освобождений, служебных записок и благодарственных писем в формате .pdf по шаблонам .docx</p>
      <div className="flex flex-col gap-4">
        {events.filter((e) => e.isRegistered).map((ev) => (
          <div key={ev.id} className="rounded-[20px] border border-[#0A75EA] p-5 flex flex-wrap items-center justify-between gap-4 bg-blue-50/20">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-[#0A75EA] break-words">{format(parseISO(ev.date), 'dd.MM.yyyy', { locale: ru })} • {ev.startTime}</div>
              <div className="text-xl font-bold text-black break-words">{ev.title}</div>
              <div className="text-sm text-gray-600 break-words">Шаблон: Освобождение_от_учебных_занятий.docx → .pdf</div>
            </div>
            <button onClick={() => handleDownloadPdf(ev)} className="px-5 py-3 rounded-[16px] bg-[#0A75EA] text-white font-bold flex items-center gap-2 hover:bg-[#0A75EA]/90 transition cursor-pointer shrink-0">
              <Download size={20} /> Скачать .pdf
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}