interface ProfilePageProps {
  role: 'student' | 'admin';
  setRole: (role: 'student' | 'admin') => void;
  setActiveTab: (tab: any) => void;
}

export function ProfilePage({ role, setRole, setActiveTab }: ProfilePageProps) {
  return (
    <section className="rounded-[25px] border border-[#999999] bg-white p-8 flex-1" style={{ boxShadow: '0px 0px 10px #999999' }}>
      <h1 className="text-3xl font-bold text-black mb-4">Профиль</h1>
      <div className="mb-6 flex gap-4">
        <button onClick={() => { setRole('student'); setActiveTab('calendar'); }} className={`px-6 py-3 rounded-xl font-bold transition ${role === 'student' ? 'bg-[#0A75EA] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Режим Студента</button>
        <button onClick={() => { setRole('admin'); setActiveTab('calendar'); }} className={`px-6 py-3 rounded-xl font-bold transition ${role === 'admin' ? 'bg-[#0A75EA] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Режим Администратора</button>
      </div>
      <div className="p-6 rounded-[20px] bg-blue-50/40 border border-[#0A75EA] max-w-xl">
        <p className="text-xl font-bold break-words">Иванов Алексей Сергеевич</p>
        <p className="text-gray-600 mt-1">Группа: ИВТ-31 | Институт цифровых технологий</p>
        <p className="text-gray-600">Роль: {role === 'admin' ? 'Администратор' : 'Студент'}</p>
      </div>
    </section>
  );
}