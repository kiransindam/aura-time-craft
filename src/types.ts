
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  participants?: string[];
  isAllDay?: boolean;
}

export type CalendarView = 'day' | 'week' | 'month';

export interface EventFormData {
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  isAllDay: boolean;
}

export interface DateInfo {
  year: number;
  month: number;
  day: number;
}
