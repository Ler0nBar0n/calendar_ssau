import type { DayStatusColor, EventCategory } from '../types';

export const COLOR_MAP: Record<DayStatusColor, string> = {
  green: '#97D700',
  yellow: '#EAAA00',
  orange: '#EA8000',
  red: '#E4002B',
};

export const CATEGORY_LABELS: Record<EventCategory, { label: string; color: string }> = {
  science: { label: 'Наука и IT', color: '#0A75EA' },
  volunteer: { label: 'Волонтерство', color: '#97D700' },
  culture: { label: 'Творчество и актив', color: '#EA8000' },
};

export const INPUT_CLASS = "w-full px-4 py-3 rounded-xl border border-[#999999] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0A75EA] focus:border-transparent transition-all";