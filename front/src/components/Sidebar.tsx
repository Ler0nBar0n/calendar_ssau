import { Calendar as CalendarIcon, FileText, Clock, ShieldCheck, Sparkles, User } from 'lucide-react';
import type { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  role: 'student' | 'admin';
}

export function Sidebar({ activeTab, setActiveTab, role }: SidebarProps) {
  const allSidebarItems = [
    { id: 'calendar' as ActiveTab, label: 'Календарь мероприятий', icon: <CalendarIcon size={28} />, roles: ['student', 'admin'] },
    { id: 'afisha' as ActiveTab, label: 'Ближайшие мероприятия', icon: <Sparkles size={28} />, roles: ['student', 'admin'] },
    { id: 'documents' as ActiveTab, label: 'Документы и PDF', icon: <FileText size={28} />, roles: ['student', 'admin'] },
    { id: 'personal' as ActiveTab, label: 'Личная занятость', icon: <Clock size={28} />, roles: ['student', 'admin'] },
    { id: 'admin' as ActiveTab, label: 'Админ-панель', icon: <ShieldCheck size={28} />, roles: ['admin'] },
  ];

  const sidebarItems = allSidebarItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className="fixed left-4 top-4 lg:left-5 lg:top-5 z-20 w-[100px] h-[calc(100vh-2rem)] lg:h-[calc(100vh-2.5rem)] rounded-[25px] border border-[#999999] bg-white flex flex-col items-center justify-between px-3 py-4 overflow-y-auto overflow-x-hidden"
      style={{ boxShadow: '0px 0px 10px #999999' }}
    >
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setActiveTab('calendar')}
          title="Календарь студенческих мероприятий"
          className="w-[70px] h-[70px] p-2.5 rounded-[18px] flex items-center justify-center transition cursor-pointer"
        >
          <img src="/logo.svg" alt="Логотип" className="w-[56px] h-[52px] object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
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
  );
}