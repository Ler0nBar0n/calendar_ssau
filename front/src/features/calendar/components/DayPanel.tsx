import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter, MapPin } from 'lucide-react';
import type { CampusEvent, EventCategory } from '../../../types';

interface DayPanelProps {
  formattedSelectedDayTitle: string;
  categoryFilter: EventCategory | 'all';
  setCategoryFilter: (cat: EventCategory | 'all') => void;
  dayEvents: CampusEvent[];
  setSelectedEventModal: (ev: CampusEvent) => void;
}

export function DayPanel({ formattedSelectedDayTitle, categoryFilter, setCategoryFilter, dayEvents, setSelectedEventModal }: DayPanelProps) {
  return (
    <section className="rounded-[25px] border border-[#0A75EA] bg-white overflow-hidden flex flex-col" style={{ boxShadow: '0px 0px 10px #0A75EA', minHeight: '564px' }}>
      <div className="min-h-[85px] bg-[#0A75EA] px-6 py-3 flex items-center justify-between text-white gap-4">
        <h2 className="text-[24px] sm:text-[32px] leading-snug break-words">
          <span className="font-bold">{formattedSelectedDayTitle.split(',')[0]}, {formattedSelectedDayTitle.split(',')[1]?.trim().split(' ')[0]}</span>{' '}
          <span className="font-normal">{formattedSelectedDayTitle.split(',')[1]?.trim().split(' ')[1]}</span>
        </h2>
        <div className="flex items-center gap-3 shrink-0">
          {[{ id: 'science', title: 'Наука и IT' }, { id: 'volunteer', title: 'Волонтерство' }, { id: 'culture', title: 'Творчество и актив' }].map((flt) => {
            const active = categoryFilter === flt.id;
            return (
              <button
                key={flt.id}
                onClick={() => setCategoryFilter(active ? 'all' : flt.id as EventCategory)}
                title={`Фильтр: ${flt.title}`}
                className="w-[45px] h-[45px] px-2.5 py-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: active ? '#FFFFFF' : '#D9D9D9',
                  color: active ? '#0A75EA' : '#555555',
                  transform: active ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <Filter size={18} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto max-h-[479px]">
        {dayEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-[#999999] py-12">
            <CalendarIcon size={48} className="mb-3 opacity-50" />
            <p className="text-xl font-semibold text-gray-600">На этот день мероприятий нет</p>
            <p className="text-sm mt-1">Выберите другую дату в календаре или сбросьте фильтр в шапке</p>
          </div>
        ) : (
          dayEvents.map((ev, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEventModal(ev)}
                className="min-h-[100px] rounded-[25px] bg-white flex items-center transition-all hover:scale-[1.01] cursor-pointer"
                style={{
                  border: isFirst ? '1px solid #0A75EA' : '1px solid #999999',
                  boxShadow: isFirst ? '0px 0px 10px #0A75EA' : '0px 0px 10px #999999',
                }}
              >
                <div className="w-[108px] shrink-0 flex flex-col items-center justify-center text-[#0A75EA] font-bold px-2">
                  <div className="leading-none">
                    <span className="text-[32px]">{ev.startTime.split(':')[0]}</span><span className="text-[20px]">:{ev.startTime.split(':')[1]}</span>
                  </div>
                  {ev.endTime && (
                    <div className="leading-none mt-1">
                      <span className="text-[32px]">{ev.endTime.split(':')[0]}</span><span className="text-[20px]">:{ev.endTime.split(':')[1]}</span>
                    </div>
                  )}
                </div>
                <div className="w-[1px] h-[78px] bg-[#D9D9D9] shrink-0" />
                <div className="flex-1 px-5 py-3.5 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0A75EA] leading-snug break-words">{ev.title}</h3>
                    {ev.isRegistered && (
                      <span className="shrink-0 text-xs font-bold bg-blue-50 text-[#0A75EA] border border-[#0A75EA]/30 px-3 py-1.5 rounded-full">Вы записаны</span>
                    )}
                  </div>
                  <p className="text-[16px] text-black leading-snug break-words mt-1">{ev.description}</p>
                  <p className="text-[15px] text-gray-600 flex items-center gap-1.5 break-words mt-1">
                    <MapPin size={15} className="text-[#0A75EA] shrink-0" /><span>{ev.location}</span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}