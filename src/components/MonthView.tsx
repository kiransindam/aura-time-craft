
import React from 'react';
import { useCalendar } from '@/contexts/CalendarContext';
import { getMonthDates, getEventsForDay, isToday } from '@/utils/calendarUtils';
import { CalendarEvent } from '@/types';
import { cn } from '@/lib/utils';

const MAX_VISIBLE_EVENTS = 3;

const MonthView: React.FC = () => {
  const { events, selectedDate, setSelectedDate, setSelectedEvent } = useCalendar();
  const dates = getMonthDates(selectedDate.getFullYear(), selectedDate.getMonth());
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  // Day names row
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="fade-in">
      <div className="calendar-grid gap-1 mb-1">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid gap-1">
        {dates.map((date, index) => {
          const dateEvents = getEventsForDay(events, date);
          const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
          const isTodayDate = isToday(date);
          const isSelected = date.getDate() === selectedDate.getDate() && 
                           date.getMonth() === selectedDate.getMonth() &&
                           date.getFullYear() === selectedDate.getFullYear();
          
          return (
            <div 
              key={index}
              onClick={() => handleDateClick(date)}
              className={cn(
                "calendar-day",
                isTodayDate && "today",
                isSelected && "selected",
                !isCurrentMonth && "different-month"
              )}
            >
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-sm">{date.getDate()}</span>
                {dateEvents.length > MAX_VISIBLE_EVENTS && (
                  <span className="text-xs bg-muted rounded-full px-1 text-muted-foreground">
                    +{dateEvents.length - MAX_VISIBLE_EVENTS}
                  </span>
                )}
              </div>
              
              <div className="flex-1 w-full overflow-hidden">
                {dateEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className="event-item"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
