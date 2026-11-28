import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { CampusEvent } from '../../../types';

interface EventModalProps {
  event: CampusEvent;
  onClose: () => void;
  onToggleRegistration: (id: string) => void;
  onDownloadPdf: (ev: CampusEvent) => void;
}

export function EventModal({ event, onClose, onToggleRegistration, onDownloadPdf }: EventModalProps) {
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-[25px] bg-white border border-[#0A75EA] overflow-hidden" style={{ boxShadow: '0px 0px 25px rgba(10, 117, 234, 0.35)' }}>
        <div className="bg-[#0A75EA] px-6 py-5 text-white flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-sm opacity-90 break-words">
              {format(parseISO(event.date), 'dd.MM.yyyy', { locale: ru })} | {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
            </span>
            <h3 className="text-2xl font-bold mt-0.5 break-words">{event.title}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center cursor-pointer shrink-0">
            <img src="/Group%2041.svg" alt="Закрыть" className="w-9 h-9 object-contain" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p className="text-base text-gray-800 break-words">{event.description}</p>
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <img src="/Group%2037.svg" alt="Место" className="w-[18px] h-[18px] shrink-0 object-contain" />
              <span className="break-words"><strong>Место:</strong> {event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Group%2024.svg" alt="Организатор" className="w-[18px] h-[18px] shrink-0 object-contain" />
              <span className="break-words"><strong>Организатор:</strong> {event.organizer}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/Group%2038.svg" alt="Участники" className="w-[18px] h-[18px] shrink-0 object-contain" />
              <span><strong>Участники:</strong> {event.seatsTaken} из {event.seatsTotal}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => onToggleRegistration(event.id)}
              className={`flex-1 py-3.5 px-6 rounded-[16px] font-bold text-white transition cursor-pointer ${event.isRegistered ? 'bg-[#E4002B] hover:bg-[#E4002B]/90' : 'bg-[#0A75EA] hover:bg-[#0A75EA]/90'}`}
            >
              {event.isRegistered ? 'Отменить запись' : 'Записаться на мероприятие'}
            </button>
            {event.hasExcuseDoc && (
              <button onClick={() => onDownloadPdf(event)} className="py-3.5 px-6 rounded-[16px] border border-[#0A75EA] text-[#0A75EA] font-bold hover:bg-blue-50 transition cursor-pointer">
                Освобождение (.pdf)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}