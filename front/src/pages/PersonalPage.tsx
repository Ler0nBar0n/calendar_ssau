import { format, parseISO } from 'date-fns';
import type { PersonalTask } from '../types';
import { INPUT_CLASS } from '../constants';

interface PersonalPageProps {
  personalTasks: PersonalTask[];
  selectedDateStr: string;
  newTaskTitle: string;
  setNewTaskTitle: (t: string) => void;
  newTaskTime: string;
  setNewTaskTime: (t: string) => void;
  handleAddPersonalTask: (e: React.FormEvent) => void;
  handleRemovePersonalTask: (id: string) => void;
}

export function PersonalPage({
  personalTasks,
  selectedDateStr,
  newTaskTitle,
  setNewTaskTitle,
  newTaskTime,
  setNewTaskTime,
  handleAddPersonalTask,
  handleRemovePersonalTask,
}: PersonalPageProps) {
  return (
    <section className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1" style={{ boxShadow: '0px 0px 10px #999999' }}>
      <h1 className="text-3xl font-bold text-black mb-2">Личный планировщик занятости</h1>
      <p className="text-gray-600 mb-6">Добавляйте личные дедлайны и пары на выбранную дату ({format(parseISO(selectedDateStr), 'dd.MM.yyyy')})</p>
      <form onSubmit={handleAddPersonalTask} className="flex flex-wrap gap-3 mb-6">
        <input type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} className={`${INPUT_CLASS} max-w-[150px] font-bold`} />
        <input type="text" placeholder="Например: Консультация по курсовой..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className={`${INPUT_CLASS} flex-1 min-w-[240px]`} />
        <button type="submit" className="px-6 py-3 rounded-xl bg-[#0A75EA] text-white font-bold cursor-pointer hover:bg-[#0A75EA]/90 transition">
          Добавить
        </button>
      </form>
      <div className="flex flex-col gap-3">
        {personalTasks.map((t) => (
          <div key={t.id} className="p-4 rounded-[18px] border border-[#D9D9D9] flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <span className="px-3 py-1.5 rounded-xl bg-[#0A75EA] text-white font-bold shrink-0">{format(parseISO(t.date), 'dd.MM.yyyy')} | {t.time}</span>
              <span className="text-lg font-semibold break-words min-w-0">{t.title}</span>
            </div>
            <button
              onClick={() => handleRemovePersonalTask(t.id)}
              title="Удалить задачу"
              className="w-9 h-9 flex items-center justify-center cursor-pointer hover:opacity-70 transition shrink-0"
            >
              <img src="/Group%2041.svg" alt="Удалить" className="w-6 h-6 object-contain" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}