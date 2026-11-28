import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { INITIAL_EVENTS } from './mockData';
import type { CampusEvent, PersonalTask, EventCategory, ActiveTab } from './types';

// Компоненты и страницы
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { EventModal } from './features/calendar/components/EventModal';
import { CalendarPage } from './pages/CalendarPage';
import { AfishaPage } from './pages/AfishaPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { PersonalPage } from './pages/PersonalPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [selectedEventModal, setSelectedEventModal] = useState<CampusEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([
    { id: 'p-1', date: '2026-11-26', time: '15:30', title: 'Сдача лабораторной работы №4' },
    { id: 'p-2', date: '2026-11-27', time: '17:00', title: 'Подготовка презентации к защите' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('16:00');

  const [adminTitle, setAdminTitle] = useState('');
  const [adminDate, setAdminDate] = useState('2026-11-26');
  const [adminStart, setAdminStart] = useState('14:00');
  const [adminEnd, setAdminEnd] = useState('15:30');
  const [adminLocation, setAdminLocation] = useState('');
  const [adminDesc, setAdminDesc] = useState('');
  const [adminCategory, setAdminCategory] = useState<EventCategory>('science');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const currentWeekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const dayEvents = useMemo(() => {
    return events
      .filter((e) => e.date === selectedDateStr)
      .filter((e) => (categoryFilter === 'all' ? true : e.category === categoryFilter))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, selectedDateStr, categoryFilter]);

  const toggleRegistration = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const nextReg = !ev.isRegistered;
        showToast(nextReg ? `Вы записаны на «${ev.title}».` : `Запись на «${ev.title}» отменена.`);
        return { ...ev, isRegistered: nextReg, seatsTaken: nextReg ? ev.seatsTaken + 1 : ev.seatsTaken - 1 };
      })
    );
    setSelectedEventModal((prev) => prev && prev.id === eventId ? { ...prev, isRegistered: !prev.isRegistered } : prev);
  };

  const handleDownloadPdf = (ev: CampusEvent) => showToast(`Сформирован PDF: Освобождение_${ev.date}.pdf`);

  const handleAdminCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle.trim() || !adminLocation.trim()) return;
    const newEvt: CampusEvent = {
      id: `evt-${Date.now()}`, date: adminDate, startTime: adminStart, endTime: adminEnd || undefined,
      title: adminTitle, description: adminDesc || 'Мероприятие студенческого актива', location: adminLocation,
      category: adminCategory, organizer: 'Администрация кампуса', seatsTotal: 60, seatsTaken: 1, isRegistered: false, hasExcuseDoc: true,
    };
    setEvents((prev) => [...prev, newEvt]);
    setAdminTitle(''); setAdminLocation(''); setAdminDesc('');
    setSelectedDate(parseISO(adminDate)); setActiveTab('calendar');
    showToast('Мероприятие опубликовано!');
  };

  const handleAddPersonalTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setPersonalTasks((prev) => [...prev, { id: `p-${Date.now()}`, date: selectedDateStr, time: newTaskTime, title: newTaskTitle }]);
    setNewTaskTitle('');
    showToast('Личная задача добавлена');
  };

  const formattedMonthTitle = useMemo(() => {
    const raw = format(currentMonth, 'LLLL yyyy', { locale: ru });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [currentMonth]);

  const formattedSelectedDayTitle = useMemo(() => {
    const weekday = format(selectedDate, 'EEEE', { locale: ru });
    const dayAndMonth = format(selectedDate, 'd MMMM', { locale: ru });
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dayAndMonth}`;
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] pl-[120px] lg:pl-[124px] pr-4 lg:pr-5 py-4 lg:py-5 overflow-x-auto">
      <div className="w-full max-w-[1400px] mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} />
        
        <main className="flex-1 flex flex-col gap-5 min-w-0">
          {activeTab === 'calendar' && (
            <CalendarPage
              currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} monthDays={monthDays}
              selectedDate={selectedDate} setSelectedDate={setSelectedDate} events={events}
              formattedMonthTitle={formattedMonthTitle} formattedSelectedDayTitle={formattedSelectedDayTitle}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              dayEvents={dayEvents} currentWeekDays={currentWeekDays} setSelectedEventModal={setSelectedEventModal}
            />
          )}

          {activeTab === 'afisha' && <AfishaPage events={events} toggleRegistration={toggleRegistration} setActiveTab={setActiveTab} />}
          
          {activeTab === 'documents' && <DocumentsPage events={events} handleDownloadPdf={handleDownloadPdf} />}
          
          {activeTab === 'personal' && (
            <PersonalPage personalTasks={personalTasks} selectedDateStr={selectedDateStr}
              newTaskTitle={newTaskTitle} setNewTaskTitle={setNewTaskTitle} newTaskTime={newTaskTime} setNewTaskTime={setNewTaskTime}
              handleAddPersonalTask={handleAddPersonalTask}
            />
          )}

          {activeTab === 'admin' && role === 'admin' && (
            <AdminPage adminTitle={adminTitle} setAdminTitle={setAdminTitle} adminDate={adminDate} setAdminDate={setAdminDate}
              adminStart={adminStart} setAdminStart={setAdminStart} adminEnd={adminEnd} setAdminEnd={setAdminEnd}
              adminLocation={adminLocation} setAdminLocation={setAdminLocation} adminDesc={adminDesc} setAdminDesc={setAdminDesc}
              adminCategory={adminCategory} setAdminCategory={setAdminCategory} handleAdminCreate={handleAdminCreate}
            />
          )}

          {activeTab === 'profile' && <ProfilePage role={role} setRole={setRole} setActiveTab={setActiveTab} />}
        </main>
      </div>

      {selectedEventModal && (
        <EventModal event={selectedEventModal} onClose={() => setSelectedEventModal(null)} onToggleRegistration={toggleRegistration} onDownloadPdf={handleDownloadPdf} />
      )}

      <Toast message={toastMessage} />
    </div>
  );
}

export default App;