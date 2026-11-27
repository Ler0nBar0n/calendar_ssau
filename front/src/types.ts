export type DayStatusColor = 'green' | 'yellow' | 'orange' | 'red';

export type EventCategory = 'science' | 'volunteer' | 'culture';

export interface CampusEvent {
  id: string;
  date: string; // формат 'YYYY-MM-DD'
  startTime: string;
  endTime?: string;
  title: string;
  description: string;
  location: string;
  category: EventCategory;
  organizer: string;
  seatsTotal: number;
  seatsTaken: number;
  isRegistered?: boolean;
  hasExcuseDoc?: boolean; // доступно ли освобождение от учебы (.pdf)
}

export interface PersonalTask {
  id: string;
  date: string;
  time: string;
  title: string;
}