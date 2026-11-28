import type { CampusEvent } from '../types';
import { MonthGrid } from '../features/calendar/components/MonthGrid';
import { DayPanel } from '../features/calendar/components/DayPanel';
import { WeekSchedule } from '../features/calendar/components/WeekSchedule';

interface CalendarPageProps {
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
  monthDays: Date[];
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  events: CampusEvent[];
  formattedMonthTitle: string;
  formattedSelectedDayTitle: string;
  dayEvents: CampusEvent[];
  currentWeekDays: Date[];
  setSelectedEventModal: (ev: CampusEvent) => void;
}

export function CalendarPage(props: CalendarPageProps) {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[564px_1fr] gap-5">
        <MonthGrid
          currentMonth={props.currentMonth} setCurrentMonth={props.setCurrentMonth}
          monthDays={props.monthDays} selectedDate={props.selectedDate} setSelectedDate={props.setSelectedDate}
          events={props.events} formattedMonthTitle={props.formattedMonthTitle}
        />
        <DayPanel
          formattedSelectedDayTitle={props.formattedSelectedDayTitle}
          dayEvents={props.dayEvents} setSelectedEventModal={props.setSelectedEventModal}
        />
      </div>
      <WeekSchedule
        currentWeekDays={props.currentWeekDays} events={props.events}
        selectedDate={props.selectedDate} setSelectedDate={props.setSelectedDate}
        setSelectedEventModal={props.setSelectedEventModal}
      />
    </>
  );
}