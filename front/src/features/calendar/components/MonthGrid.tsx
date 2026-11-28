import { format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CampusEvent } from '../../../types';
import { getDayBadgeColor } from '../../../utils/dateUtils';

interface MonthGridProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  monthDays: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: CampusEvent[];
  formattedMonthTitle: string;
}

export function MonthGrid({ currentMonth, setCurrentMonth, monthDays, selectedDate, setSelectedDate, events, formattedMonthTitle }: MonthGridProps) {
  return (
    <section className="rounded-[25px] border border-[#999999] bg-white overflow-hidden flex flex-col" style={{ boxShadow: '0px 0px 10px #999999', minHeight: '564px' }}>
      <div className="h-[85px] bg-[#0A75EA] px-5 flex items-center justify-between text-white">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-11 h-11 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer">
          <ChevronLeft size={32} />
        </button>
        <h2 className="text-[32px] sm:text-[36px] tracking-tight">
          <span className="font-bold">{formattedMonthTitle.split(' ')[0]}</span> <span className="font-normal">{formattedMonthTitle.split(' ')[1]}</span>
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-11 h-11 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer">
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="px-5 pt-6 pb-3 grid grid-cols-7 text-center">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((dayName, idx) => (
          <div key={dayName} className="text-[28px] sm:text-[32px] font-normal leading-none" style={{ color: idx >= 5 ? '#E4002B' : '#0A75EA' }}>
            {dayName}
          </div>
        ))}
      </div>

      <div className="px-5 pb-6 pt-2 grid grid-cols-7 gap-y-4 place-items-center flex-1">
        {monthDays.map((day) => {
          const inCurrentMonth = isSameMonth(day, currentMonth);
          if (!inCurrentMonth) return <div key={day.toISOString()} className="w-[45px] h-[45px]" />;

          const isSelected = isSameDay(day, selectedDate);
          const bgColor = getDayBadgeColor(day, selectedDate, events);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className="w-[45px] h-[45px] rounded-full text-white font-bold text-[22px] sm:text-[24px] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              style={{
                backgroundColor: bgColor,
                boxShadow: isSelected ? '0px 0px 12px #0A75EA' : 'none',
                transform: isSelected ? 'scale(1.08)' : undefined,
              }}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </section>
  );
}