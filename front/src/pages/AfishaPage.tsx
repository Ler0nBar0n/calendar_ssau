import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { CampusEvent } from '../types';
import { CATEGORY_LABELS } from '../constants';

interface AfishaPageProps {
  events: CampusEvent[];
  toggleRegistration: (id: string) => void;
  setActiveTab: (tab: any) => void;
}

export function AfishaPage({ events, toggleRegistration, setActiveTab }: AfishaPageProps) {
  return (
    <section className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1" style={{ boxShadow: '0px 0px 10px #999999' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9D9D9] pb-6 mb-6">
        <h1 className="text-3xl font-bold text-black">Ближайшие мероприятия кампуса</h1>
        <button onClick={() => setActiveTab('calendar')} className="px-5 py-3 rounded-[18px] bg-[#0A75EA] text-white font-bold hover:bg-[#0A75EA]/90 transition cursor-pointer">Вернуться в сетку календаря</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((ev) => (
          <div key={ev.id} className="rounded-[25px] border border-[#999999] p-5 flex flex-col justify-between bg-white hover:border-[#0A75EA] transition" style={{ boxShadow: '0px 0px 8px rgba(153,153,153,0.35)' }}>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-white px-3 py-1 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_LABELS[ev.category].color }}>{CATEGORY_LABELS[ev.category].label}</span>
                <span className="text-sm font-bold text-[#0A75EA] shrink-0">{format(parseISO(ev.date), 'dd.MM.yyyy', { locale: ru })} • {ev.startTime}</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2 break-words">{ev.title}</h3>
              <p className="text-gray-600 text-sm mb-4 break-words">{ev.description}</p>
            </div>
            <div className="pt-4 border-t border-[#D9D9D9] flex items-center justify-between">
              <span className="text-xs text-gray-500">Мест: {ev.seatsTaken}/{ev.seatsTotal}</span>
              <button onClick={() => toggleRegistration(ev.id)} className={`px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${ev.isRegistered ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-[#0A75EA] text-white hover:bg-[#0A75EA]/90'}`}>
                {ev.isRegistered ? 'Вы записаны ✓' : 'Записаться'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}