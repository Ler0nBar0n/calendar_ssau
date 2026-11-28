import { format, isSameDay } from 'date-fns';
import type { CampusEvent } from '../../../types';
import { getDayStatusColor } from '../../../utils/dateUtils';

interface WeekScheduleProps {
  currentWeekDays: Date[];
  events: CampusEvent[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setSelectedEventModal: (ev: CampusEvent) => void;
}

export function WeekSchedule({ currentWeekDays, events, selectedDate, setSelectedDate, setSelectedEventModal }: WeekScheduleProps) {
  const shortDayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <section className="rounded-[25px] border border-[#999999] bg-white overflow-hidden flex flex-col" style={{ boxShadow: '0px 0px 10px #999999', minHeight: '400px' }}>
      <div className="grid grid-cols-7 flex-1 divide-x divide-[#D9D9D9] pt-2.5">
        {currentWeekDays.map((day, idx) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayItems = events.filter((e) => e.date === dayStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
          const badgeColor = getDayStatusColor(day, events);
          const isFirstCol = idx === 0;
          const isLastCol = idx === 6;

          return (
            <div key={dayStr} className="flex flex-col min-w-0">
              <div
                onClick={() => setSelectedDate(day)}
                className={`h-[65px] bg-[#0A75EA] px-3.5 py-2 flex items-center justify-between gap-2 cursor-pointer transition-opacity hover:opacity-90 ${
                  isFirstCol ? 'ml-2.5 rounded-l-[25px]' : ''
                } ${isLastCol ? 'mr-2.5 rounded-r-[25px]' : ''}`}
              >
                <span className="text-white text-[22px] sm:text-[24px] font-normal px-1">{shortDayNames[idx]}</span>
                <span
                  className="w-[42px] h-[42px] sm:w-[45px] sm:h-[45px] px-1 rounded-full text-white font-bold text-[20px] sm:text-[24px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: badgeColor }}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="p-3 flex flex-col gap-2.5 overflow-y-auto max-h-[315px]">
                {dayItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedDate(day); setSelectedEventModal(item); }}
                    className="text-left group hover:bg-blue-50 px-2.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    <div className="text-[16px] sm:text-[17px] font-bold text-black group-hover:text-[#0A75EA] leading-snug break-words">{item.title}</div>
                    <div className="text-[14px] text-gray-600 leading-snug mt-0.5">{item.startTime}{item.endTime ? ` – ${item.endTime}` : ''}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}