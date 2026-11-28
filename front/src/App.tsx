import React, { useState, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  FileText,
  Clock,
  ShieldCheck,
  Sparkles,
  User,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Download,
  CheckCircle2,
  Plus,
  X,
  Filter,
} from 'lucide-react';
import { INITIAL_EVENTS } from './mockData';
import type { CampusEvent, DayStatusColor, EventCategory, PersonalTask } from './types';

type ActiveTab = 'calendar' | 'documents' | 'personal' | 'admin' | 'afisha' | 'profile';

const COLOR_MAP: Record<DayStatusColor, string> = {
  green: '#97D700',
  yellow: '#EAAA00',
  orange: '#EA8000',
  red: '#E4002B',
};

const CATEGORY_LABELS: Record<EventCategory, { label: string; color: string }> = {
  science: { label: 'Наука и IT', color: '#0A75EA' },
  volunteer: { label: 'Волонтерство', color: '#97D700' },
  culture: { label: 'Творчество и актив', color: '#EA8000' },
};

// Единый стиль для всех полей ввода (Пункт 6 и 8)
const INPUT_CLASS = "w-full px-4 py-3 rounded-xl border border-[#999999] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0A75EA] focus:border-transparent transition-all";

export function App() {
  const [role, setRole] = useState<'student' | 'admin'>('student'); // Разделение ролей (Пункт 5)
  
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

  // Чистый цвет статуса (без синего выделения) — используется в нижней неделе
  const getDayStatusColor = (day: Date): string => {
    const key = format(day, 'yyyy-MM-dd');
    const count = events.filter((e) => e.date === key).length;
    if (count === 0) return COLOR_MAP.green;
    if (count <= 2) return COLOR_MAP.yellow;
    if (count <= 4) return COLOR_MAP.orange;
    return COLOR_MAP.red;
  };

  // Цвет с синим выделением — используется в сетке месяца
  const getDayBadgeColor = (day: Date): string => {
    if (isSameDay(day, selectedDate)) {
      return '#0A75EA';
    }
    return getDayStatusColor(day);
  };

  const toggleRegistration = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const nextReg = !ev.isRegistered;
        showToast(
          nextReg
            ? `Вы записаны на «${ev.title}». Освобождение доступно во вкладке документов.`
            : `Запись на «${ev.title}» отменена.`
        );
        return {
          ...ev,
          isRegistered: nextReg,
          seatsTaken: nextReg ? ev.seatsTaken + 1 : ev.seatsTaken - 1,
        };
      })
    );
    setSelectedEventModal((prev) =>
      prev && prev.id === eventId ? { ...prev, isRegistered: !prev.isRegistered } : prev
    );
  };

  const handleDownloadPdf = (ev: CampusEvent) => {
    showToast(`Сформирован PDF-документ: Освобождение_от_учебы_${ev.date}.pdf`);
  };

  const handleAdminCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle.trim() || !adminLocation.trim()) return;
    const newEvt: CampusEvent = {
      id: `evt-${Date.now()}`,
      date: adminDate,
      startTime: adminStart,
      endTime: adminEnd || undefined,
      title: adminTitle,
      description: adminDesc || 'Мероприятие студенческого актива',
      location: adminLocation,
      category: adminCategory,
      organizer: 'Администрация кампуса',
      seatsTotal: 60,
      seatsTaken: 1,
      isRegistered: false,
      hasExcuseDoc: true,
    };
    setEvents((prev) => [...prev, newEvt]);
    setAdminTitle('');
    setAdminLocation('');
    setAdminDesc('');
    setSelectedDate(parseISO(adminDate));
    setActiveTab('calendar');
    showToast('Мероприятие успешно опубликовано в календаре!');
  };

  const handleAddPersonalTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setPersonalTasks((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, date: selectedDateStr, time: newTaskTime, title: newTaskTitle },
    ]);
    setNewTaskTitle('');
    showToast('Личная задача добавлена в расписание');
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

  // Динамическое меню в зависимости от роли (Пункт 5)
  const allSidebarItems = [
    { id: 'calendar' as ActiveTab, label: 'Календарь мероприятий', icon: <CalendarIcon size={28} />, roles: ['student', 'admin'] },
    { id: 'afisha' as ActiveTab, label: 'Ближайшие мероприятия', icon: <Sparkles size={28} />, roles: ['student', 'admin'] }, // Пункт 11
    { id: 'documents' as ActiveTab, label: 'Документы и PDF', icon: <FileText size={28} />, roles: ['student', 'admin'] },
    { id: 'personal' as ActiveTab, label: 'Личная занятость', icon: <Clock size={28} />, roles: ['student', 'admin'] },
    { id: 'admin' as ActiveTab, label: 'Админ-панель', icon: <ShieldCheck size={28} />, roles: ['admin'] },
  ];

  const sidebarItems = allSidebarItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[#FFFFFF] pl-[120px] lg:pl-[124px] pr-4 lg:pr-5 py-4 lg:py-5 overflow-x-auto">
      <div className="w-full max-w-[1400px] mx-auto">
        
        {/* ================= ЛЕВАЯ БОКОВАЯ ПАНЕЛЬ ================= */}
        <aside
          className="fixed left-4 top-4 lg:left-5 lg:top-5 z-20 w-[100px] h-[calc(100vh-2rem)] lg:h-[calc(100vh-2.5rem)] rounded-[25px] border border-[#999999] bg-white flex flex-col items-center justify-between px-3 py-4 overflow-y-auto overflow-x-hidden"
          style={{ boxShadow: '0px 0px 10px #999999' }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Логотип (без ховера - Пункт 10) */}
            <button
              onClick={() => setActiveTab('calendar')}
              title="Календарь студенческих мероприятий"
              className="w-[70px] h-[70px] p-2.5 rounded-[18px] flex items-center justify-center transition cursor-pointer"
            >
              <img
                src="/logo.svg"
                alt="Логотип"
                className="w-[56px] h-[52px] object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </button>

            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className="group relative w-[70px] h-[70px] p-2.5 rounded-full flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    backgroundColor: isActive ? '#0A75EA' : '#D9D9D9',
                    color: isActive ? '#FFFFFF' : '#555555',
                    boxShadow: isActive ? '0px 0px 10px #0A75EA' : 'none',
                  }}
                >
                  {item.icon}
                  <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute left-[82px] z-30 whitespace-nowrap bg-[#1E293B] text-white text-sm font-medium px-3 py-1.5 rounded-xl shadow-lg max-w-[min(80vw,320px)] break-words">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            title="Профиль"
            className="group relative w-[70px] h-[70px] p-2.5 rounded-full flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: activeTab === 'profile' ? '#0A75EA' : '#D9D9D9',
              color: activeTab === 'profile' ? '#FFFFFF' : '#555555',
              boxShadow: activeTab === 'profile' ? '0px 0px 10px #0A75EA' : 'none',
            }}
          >
            <User size={30} />
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute left-[82px] z-30 whitespace-nowrap bg-[#1E293B] text-white text-sm font-medium px-3 py-1.5 rounded-xl shadow-lg max-w-[min(80vw,320px)] break-words">
              Профиль
            </span>
          </button>
        </aside>

        {/* ================= ОСНОВНАЯ РАБОЧАЯ ОБЛАСТЬ ================= */}
        <main className="flex-1 flex flex-col gap-5 min-w-0">
          {activeTab === 'calendar' && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-[564px_1fr] gap-5">
                {/* 1. БЛОК КАЛЕНДАРЯ МЕСЯЦА */}
                <section
                  className="rounded-[25px] border border-[#999999] bg-white overflow-hidden flex flex-col"
                  style={{ boxShadow: '0px 0px 10px #999999', minHeight: '564px' }}
                >
                  <div className="h-[85px] bg-[#0A75EA] px-5 flex items-center justify-between text-white">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="w-11 h-11 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
                      aria-label="Предыдущий месяц"
                    >
                      <ChevronLeft size={32} />
                    </button>

                    <h2 className="text-[32px] sm:text-[36px] tracking-tight">
                      <span className="font-bold">{formattedMonthTitle.split(' ')[0]}</span>{' '}
                      <span className="font-normal">{formattedMonthTitle.split(' ')[1]}</span>
                    </h2>

                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="w-11 h-11 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
                      aria-label="Следующий месяц"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </div>

                  <div className="px-5 pt-6 pb-3 grid grid-cols-7 text-center">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((dayName, idx) => (
                      <div
                        key={dayName}
                        className="text-[28px] sm:text-[32px] font-normal leading-none"
                        style={{ color: idx >= 5 ? '#E4002B' : '#0A75EA' }}
                      >
                        {dayName}
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pb-6 pt-2 grid grid-cols-7 gap-y-4 place-items-center flex-1">
                    {monthDays.map((day) => {
                      const inCurrentMonth = isSameMonth(day, currentMonth);
                      if (!inCurrentMonth) {
                        return <div key={day.toISOString()} className="w-[45px] h-[45px]" />;
                      }

                      const isSelected = isSameDay(day, selectedDate);
                      const bgColor = getDayBadgeColor(day);

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

                {/* 2. БЛОК ДЕТАЛЬНОГО ДНЯ */}
                <section
                  className="rounded-[25px] border border-[#0A75EA] bg-white overflow-hidden flex flex-col"
                  style={{ boxShadow: '0px 0px 10px #0A75EA', minHeight: '564px' }}
                >
                  <div className="min-h-[85px] bg-[#0A75EA] px-6 py-3 flex items-center justify-between text-white gap-4">
                    <h2 className="text-[24px] sm:text-[32px] leading-snug break-words">
                      <span className="font-bold">
                        {formattedSelectedDayTitle.split(',')[0]},{' '}
                        {formattedSelectedDayTitle.split(',')[1]?.trim().split(' ')[0]}
                      </span>{' '}
                      <span className="font-normal">
                        {formattedSelectedDayTitle.split(',')[1]?.trim().split(' ')[1]}
                      </span>
                    </h2>

                    <div className="flex items-center gap-3 shrink-0">
                      {(
                        [
                          { id: 'science', title: 'Наука и IT' },
                          { id: 'volunteer', title: 'Волонтерство' },
                          { id: 'culture', title: 'Творчество и актив' },
                        ] as { id: EventCategory; title: string }[]
                      ).map((flt) => {
                        const active = categoryFilter === flt.id;
                        return (
                          <button
                            key={flt.id}
                            onClick={() => setCategoryFilter(active ? 'all' : flt.id)}
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
                        <p className="text-xl font-semibold text-gray-600">
                          На этот день мероприятий нет
                        </p>
                        <p className="text-sm mt-1">
                          Выберите другую дату в календаре или сбросьте фильтр в шапке
                        </p>
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
                                <span className="text-[32px]">{ev.startTime.split(':')[0]}</span>
                                <span className="text-[20px]">:{ev.startTime.split(':')[1]}</span>
                              </div>
                              {ev.endTime && (
                                <div className="leading-none mt-1">
                                  <span className="text-[32px]">{ev.endTime.split(':')[0]}</span>
                                  <span className="text-[20px]">:{ev.endTime.split(':')[1]}</span>
                                </div>
                              )}
                            </div>

                            <div className="w-[1px] h-[78px] bg-[#D9D9D9] shrink-0" />

                            <div className="flex-1 px-5 py-3.5 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0A75EA] leading-snug break-words">
                                  {ev.title}
                                </h3>
                                {ev.isRegistered && (
                                  <span className="shrink-0 text-xs font-bold bg-blue-50 text-[#0A75EA] border border-[#0A75EA]/30 px-3 py-1.5 rounded-full">
                                    Вы записаны
                                  </span>
                                )}
                              </div>
                              <p className="text-[16px] text-black leading-snug break-words mt-1">
                                {ev.description}
                              </p>
                              <p className="text-[15px] text-gray-600 flex items-center gap-1.5 break-words mt-1">
                                <MapPin size={15} className="text-[#0A75EA] shrink-0" />
                                <span>{ev.location}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>

              {/* 3. НИЖНИЙ БЛОК: НЕДЕЛЬНОЕ РАСПИСАНИЕ */}
              <section
                className="rounded-[25px] border border-[#999999] bg-white overflow-hidden flex flex-col"
                style={{ boxShadow: '0px 0px 10px #999999', minHeight: '400px' }}
              >
                <div className="grid grid-cols-7 flex-1 divide-x divide-[#D9D9D9] pt-2.5">
                  {currentWeekDays.map((day, idx) => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const dayItems = events
                      .filter((e) => e.date === dayStr)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime));
                    
                    // Пункт 4: Не меняем цвет числа при выборе, используем чистый статус
                    const badgeColor = getDayStatusColor(day);
                    const shortDayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
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
                          <span className="text-white text-[22px] sm:text-[24px] font-normal px-1">
                            {shortDayNames[idx]}
                          </span>
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
                              onClick={() => {
                                setSelectedDate(day);
                                setSelectedEventModal(item);
                              }}
                              className="text-left group hover:bg-blue-50 px-2.5 py-2 rounded-xl transition cursor-pointer"
                            >
                              <div className="text-[16px] sm:text-[17px] font-bold text-black group-hover:text-[#0A75EA] leading-snug break-words">
                                {item.title}
                              </div>
                              <div className="text-[14px] text-gray-600 leading-snug mt-0.5">
                                {item.startTime}
                                {item.endTime ? ` – ${item.endTime}` : ''}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ================= АФИША ================= */}
          {activeTab === 'afisha' && (
            <section
              className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1"
              style={{ boxShadow: '0px 0px 10px #999999' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9D9D9] pb-6 mb-6">
                <div>
                  {/* Пункт 11: Убрали надпись Афиша студенческих событий */}
                  <h1 className="text-3xl font-bold text-black">Ближайшие мероприятия кампуса</h1>
                </div>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="px-5 py-3 rounded-[18px] bg-[#0A75EA] text-white font-bold hover:bg-[#0A75EA]/90 transition cursor-pointer"
                >
                  Вернуться в сетку календаря
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-[25px] border border-[#999999] p-5 flex flex-col justify-between bg-white hover:border-[#0A75EA] transition"
                    style={{ boxShadow: '0px 0px 8px rgba(153,153,153,0.35)' }}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span
                          className="text-xs font-bold text-white px-3 py-1 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_LABELS[ev.category].color }}
                        >
                          {CATEGORY_LABELS[ev.category].label}
                        </span>
                        {/* Пункт 3: Формат ДД.ММ.ГГГГ */}
                        <span className="text-sm font-bold text-[#0A75EA] shrink-0">
                          {format(parseISO(ev.date), 'dd.MM.yyyy', { locale: ru })} • {ev.startTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-2 break-words">{ev.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 break-words">{ev.description}</p>
                    </div>

                    <div className="pt-4 border-t border-[#D9D9D9] flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Мест: {ev.seatsTaken}/{ev.seatsTotal}
                      </span>
                      <button
                        onClick={() => toggleRegistration(ev.id)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition cursor-pointer ${
                          ev.isRegistered
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-[#0A75EA] text-white hover:bg-[#0A75EA]/90'
                        }`}
                      >
                        {ev.isRegistered ? 'Вы записаны ✓' : 'Записаться'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= ДОКУМЕНТЫ ================= */}
          {activeTab === 'documents' && (
            <section
              className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1"
              style={{ boxShadow: '0px 0px 10px #999999' }}
            >
              <h1 className="text-3xl font-bold text-black mb-2">
                Мои документы и освобождения от учебы
              </h1>
              <p className="text-gray-600 mb-6">
                Автоматическая генерация справок-освобождений, служебных записок и благодарственных
                писем в формате .pdf по шаблонам .docx
              </p>

              <div className="flex flex-col gap-4">
                {events
                  .filter((e) => e.isRegistered)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-[20px] border border-[#0A75EA] p-5 flex flex-wrap items-center justify-between gap-4 bg-blue-50/20"
                    >
                      <div className="min-w-0 flex-1">
                        {/* Пункт 3: Формат ДД.ММ.ГГГГ */}
                        <div className="text-sm font-bold text-[#0A75EA] break-words">
                          {format(parseISO(ev.date), 'dd.MM.yyyy', { locale: ru })} • {ev.startTime}
                        </div>
                        <div className="text-xl font-bold text-black break-words">{ev.title}</div>
                        <div className="text-sm text-gray-600 break-words">
                          Шаблон: Освобождение_от_учебных_занятий.docx → .pdf
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadPdf(ev)}
                        className="px-5 py-3 rounded-[16px] bg-[#0A75EA] text-white font-bold flex items-center gap-2 hover:bg-[#0A75EA]/90 transition cursor-pointer shrink-0"
                      >
                        <Download size={20} />
                        {/* Пункт 9: .pdf не капсом */}
                        Скачать .pdf
                      </button>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* ================= ЛИЧНАЯ ЗАНЯТОСТЬ ================= */}
          {activeTab === 'personal' && (
            <section
              className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1"
              style={{ boxShadow: '0px 0px 10px #999999' }}
            >
              <h1 className="text-3xl font-bold text-black mb-2">Личный планировщик занятости</h1>
              <p className="text-gray-600 mb-6">
                Добавляйте личные дедлайны и пары на выбранную дату ({format(parseISO(selectedDateStr), 'dd.MM.yyyy')})
              </p>

              <form onSubmit={handleAddPersonalTask} className="flex flex-wrap gap-3 mb-6">
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className={`${INPUT_CLASS} max-w-[150px] font-bold`}
                />
                <input
                  type="text"
                  placeholder="Например: Консультация по курсовой..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className={`${INPUT_CLASS} flex-1 min-w-[240px]`}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0A75EA] text-white font-bold flex items-center gap-2 cursor-pointer hover:bg-[#0A75EA]/90 transition"
                >
                  <Plus size={20} /> Добавить
                </button>
              </form>

              <div className="flex flex-col gap-3">
                {personalTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-[18px] border border-[#D9D9D9] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="px-3 py-1.5 rounded-xl bg-[#0A75EA] text-white font-bold shrink-0">
                        {/* Пункт 3: Формат ДД.ММ.ГГГГ */}
                        {format(parseISO(t.date), 'dd.MM.yyyy')} • {t.time}
                      </span>
                      <span className="text-lg font-semibold break-words min-w-0">{t.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= АДМИН-ПАНЕЛЬ ================= */}
          {activeTab === 'admin' && role === 'admin' && (
            <section
              className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1"
              style={{ boxShadow: '0px 0px 10px #999999' }}
            >
              <h1 className="text-3xl font-bold text-black mb-2">
                Админ-панель: Управление мероприятиями
              </h1>
              <p className="text-gray-600 mb-6">
                Создание карточек мероприятий, настройка шаблонов документов и контроль посещаемости
              </p>

              <form onSubmit={handleAdminCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">Название мероприятия *</label>
                  <input
                    type="text"
                    required
                    value={adminTitle}
                    onChange={(e) => setAdminTitle(e.target.value)}
                    placeholder="Например: Форум студенческих инициатив"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Дата проведения</label>
                  <input
                    type="date"
                    value={adminDate}
                    onChange={(e) => setAdminDate(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-bold mb-1">Начало</label>
                    <input
                      type="time"
                      value={adminStart}
                      onChange={(e) => setAdminStart(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Окончание</label>
                    <input
                      type="time"
                      value={adminEnd}
                      onChange={(e) => setAdminEnd(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Место проведения *</label>
                  <input
                    type="text"
                    required
                    value={adminLocation}
                    onChange={(e) => setAdminLocation(e.target.value)}
                    placeholder="Корпус А, Актовый зал"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Направление</label>
                  <select
                    value={adminCategory}
                    onChange={(e) => setAdminCategory(e.target.value as EventCategory)}
                    className={INPUT_CLASS}
                  >
                    <option value="science">Наука и IT</option>
                    <option value="volunteer">Волонтерство</option>
                    <option value="culture">Творчество и актив</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">Краткое описание</label>
                  <textarea
                    rows={3}
                    value={adminDesc}
                    onChange={(e) => setAdminDesc(e.target.value)}
                    placeholder="Программа, спикеры, условия участия..."
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-[18px] bg-[#0A75EA] text-white font-bold hover:bg-[#0A75EA]/90 transition cursor-pointer"
                  >
                    Опубликовать в календаре
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ================= ПРОФИЛЬ ================= */}
          {activeTab === 'profile' && (
            <section
              className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1"
              style={{ boxShadow: '0px 0px 10px #999999' }}
            >
              <h1 className="text-3xl font-bold text-black mb-4">Профиль</h1>
              
              {/* Переключатель ролей (Пункт 5) */}
              <div className="mb-6 flex gap-4">
                <button
                  onClick={() => { setRole('student'); setActiveTab('calendar'); }}
                  className={`px-6 py-3 rounded-xl font-bold transition ${role === 'student' ? 'bg-[#0A75EA] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Режим Студента
                </button>
                <button
                  onClick={() => { setRole('admin'); setActiveTab('calendar'); }}
                  className={`px-6 py-3 rounded-xl font-bold transition ${role === 'admin' ? 'bg-[#0A75EA] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Режим Администратора
                </button>
              </div>

              <div className="p-6 rounded-[20px] bg-blue-50/40 border border-[#0A75EA] max-w-xl">
                <p className="text-xl font-bold break-words">Иванов Алексей Сергеевич</p>
                <p className="text-gray-600 mt-1">
                  Группа: ИВТ-31 • Институт цифровых технологий
                </p>
                <p className="text-gray-600">Роль: {role === 'admin' ? 'Администратор' : 'Студент / Активист СНО'}</p>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ================= МОДАЛЬНОЕ ОКНО ================= */}
      {selectedEventModal && (
        <div
          onClick={() => setSelectedEventModal(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[25px] bg-white border border-[#0A75EA] overflow-hidden"
            style={{ boxShadow: '0px 0px 25px rgba(10, 117, 234, 0.35)' }}
          >
            <div className="bg-[#0A75EA] px-6 py-5 text-white flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-sm opacity-90 break-words">
                  {/* Пункт 3: Формат ДД.ММ.ГГГГ */}
                  {format(parseISO(selectedEventModal.date), 'dd.MM.yyyy', { locale: ru })} •{' '}
                  {selectedEventModal.startTime}
                  {selectedEventModal.endTime ? ` – ${selectedEventModal.endTime}` : ''}
                </span>
                <h3 className="text-2xl font-bold mt-0.5 break-words">
                  {selectedEventModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-base text-gray-800 break-words">
                {selectedEventModal.description}
              </p>

              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#0A75EA]" />
                  <span className="break-words">
                    <strong>Место:</strong> {selectedEventModal.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#0A75EA]" />
                  <span className="break-words">
                    <strong>Организатор:</strong> {selectedEventModal.organizer}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#97D700]" />
                  <span>
                    <strong>Участники:</strong> {selectedEventModal.seatsTaken} из{' '}
                    {selectedEventModal.seatsTotal}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => toggleRegistration(selectedEventModal.id)}
                  className={`flex-1 py-3.5 px-6 rounded-[16px] font-bold text-white transition cursor-pointer ${
                    selectedEventModal.isRegistered
                      ? 'bg-[#E4002B] hover:bg-[#E4002B]/90'
                      : 'bg-[#0A75EA] hover:bg-[#0A75EA]/90'
                  }`}
                >
                  {selectedEventModal.isRegistered
                    ? 'Отменить запись'
                    : 'Записаться на мероприятие'}
                </button>

                {selectedEventModal.hasExcuseDoc && (
                  <button
                    onClick={() => handleDownloadPdf(selectedEventModal)}
                    className="py-3.5 px-6 rounded-[16px] border border-[#0A75EA] text-[#0A75EA] font-bold flex items-center gap-2 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <Download size={18} />
                    Освобождение (.pdf)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Уведомление (Toast) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)] sm:max-w-md bg-[#1E293B] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 font-medium break-words">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;