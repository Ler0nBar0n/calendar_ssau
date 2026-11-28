import type { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  role: 'student' | 'admin';
}

export function Sidebar({ activeTab, setActiveTab, role }: SidebarProps) {
  const allSidebarItems = [
    { id: 'calendar' as ActiveTab, label: 'Календарь мероприятий', iconDefault: '/Group%2022.svg', iconActive: '/Group%2023.svg', roles: ['student', 'admin'] },
    { id: 'afisha' as ActiveTab, label: 'Хроника', iconDefault: '/Group%2027.svg', iconActive: '/Group%2028.svg', roles: ['student', 'admin'] },
    { id: 'documents' as ActiveTab, label: 'Документы и PDF', iconDefault: '/Group%2044.svg', iconActive: '/Group%2043.svg', roles: ['student', 'admin'] },
    { id: 'personal' as ActiveTab, label: 'Личная занятость', iconDefault: '/Group%2033.svg', iconActive: '/Group%2034.svg', roles: ['student', 'admin'] },
    { id: 'admin' as ActiveTab, label: 'Админ-панель', iconDefault: '/Group%2031.svg', iconActive: '/Group%2032.svg', roles: ['admin'] },
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
              className="group relative w-[70px] h-[70px] flex items-center justify-center transition-transform cursor-pointer"
              style={{ transform: isActive ? 'scale(1.06)' : 'scale(1)' }}
            >
              <img
                src={isActive ? item.iconActive : item.iconDefault}
                alt={item.label}
                className="w-[70px] h-[70px] object-contain"
              />
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
        className="group relative w-[70px] h-[70px] flex items-center justify-center transition-transform cursor-pointer"
        style={{ transform: activeTab === 'profile' ? 'scale(1.06)' : 'scale(1)' }}
      >
        <img
          src={activeTab === 'profile' ? '/Group%2026.svg' : '/Group%2025.svg'}
          alt="Профиль"
          className="w-[70px] h-[70px] object-contain"
        />
        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute left-[82px] z-30 whitespace-nowrap bg-[#1E293B] text-white text-sm font-medium px-3 py-1.5 rounded-xl shadow-lg max-w-[min(80vw,320px)] break-words">
          Профиль
        </span>
      </button>
    </aside>
  );
}