import { format, isSameDay } from 'date-fns';
import type { CampusEvent } from '../types';
import { COLOR_MAP } from '../constants';

// Чистый статус (0 - зел, 1-2 - желт, 3-4 - оранж, 5+ - красн)
export const getDayStatusColor = (day: Date, events: CampusEvent[]): string => {
  const key = format(day, 'yyyy-MM-dd');
  const count = events.filter((e) => e.date === key).length;
  if (count === 0) return COLOR_MAP.green;
  if (count <= 2) return COLOR_MAP.yellow;
  if (count <= 4) return COLOR_MAP.orange;
  return COLOR_MAP.red;
};

// Статус + выделение синим (для сетки месяца)
export const getDayBadgeColor = (day: Date, selectedDate: Date, events: CampusEvent[]): string => {
  if (isSameDay(day, selectedDate)) return '#0A75EA';
  return getDayStatusColor(day, events);
};