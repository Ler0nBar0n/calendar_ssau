import type { EventCategory } from '../types';
import { INPUT_CLASS } from '../constants';

interface AdminPageProps {
  adminTitle: string; setAdminTitle: (v: string) => void;
  adminDate: string; setAdminDate: (v: string) => void;
  adminStart: string; setAdminStart: (v: string) => void;
  adminEnd: string; setAdminEnd: (v: string) => void;
  adminLocation: string; setAdminLocation: (v: string) => void;
  adminDesc: string; setAdminDesc: (v: string) => void;
  adminCategory: EventCategory; setAdminCategory: (v: EventCategory) => void;
  handleAdminCreate: (e: React.FormEvent) => void;
}

export function AdminPage(props: AdminPageProps) {
  return (
    <section className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1" style={{ boxShadow: '0px 0px 10px #999999' }}>
      <h1 className="text-3xl font-bold text-black mb-2">Админ-панель: Управление мероприятиями</h1>
      <p className="text-gray-600 mb-6">Создание карточек мероприятий, настройка шаблонов документов и контроль посещаемости</p>
      <form onSubmit={props.handleAdminCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-1">Название мероприятия *</label>
          <input type="text" required value={props.adminTitle} onChange={(e) => props.setAdminTitle(e.target.value)} placeholder="Например: Форум студенческих инициатив" className={INPUT_CLASS} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Дата проведения</label>
          <input type="date" value={props.adminDate} onChange={(e) => props.setAdminDate(e.target.value)} className={INPUT_CLASS} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className="block text-sm font-bold mb-1">Начало</label><input type="time" value={props.adminStart} onChange={(e) => props.setAdminStart(e.target.value)} className={INPUT_CLASS} /></div>
          <div><label className="block text-sm font-bold mb-1">Окончание</label><input type="time" value={props.adminEnd} onChange={(e) => props.setAdminEnd(e.target.value)} className={INPUT_CLASS} /></div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Место проведения *</label>
          <input type="text" required value={props.adminLocation} onChange={(e) => props.setAdminLocation(e.target.value)} placeholder="Корпус А, Актовый зал" className={INPUT_CLASS} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Направление</label>
          <select value={props.adminCategory} onChange={(e) => props.setAdminCategory(e.target.value as EventCategory)} className={INPUT_CLASS}>
            <option value="science">Наука и IT</option>
            <option value="volunteer">Волонтерство</option>
            <option value="culture">Творчество и актив</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-1">Краткое описание</label>
          <textarea rows={3} value={props.adminDesc} onChange={(e) => props.setAdminDesc(e.target.value)} placeholder="Программа, спикеры, условия участия..." className={INPUT_CLASS} />
        </div>
        <div className="md:col-span-2 pt-2">
          <button type="submit" className="px-6 py-3.5 rounded-[18px] bg-[#0A75EA] text-white font-bold hover:bg-[#0A75EA]/90 transition cursor-pointer">Опубликовать в календаре</button>
        </div>
      </form>
    </section>
  );
}