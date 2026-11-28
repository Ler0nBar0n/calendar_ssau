export type DayStatusColor = 'green' | 'yellow' | 'orange' | 'red';

export type EventCategory = 'science' | 'volunteer' | 'culture';

export type ActiveTab = 'calendar' | 'documents' | 'personal' | 'admin' | 'afisha' | 'profile';

export interface CampusEvent {
  id: string;
  date: string;
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