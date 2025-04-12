
import React from 'react';
import { useCalendar } from '@/contexts/CalendarContext';
import { getWeekDates, formatDate } from '@/utils/calendarUtils';
import { CalendarEvent } from '@/types';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const WeekView: React.FC = () => {
  const { events, selectedDate, setSelectedDate, setSelectedEvent } = useCalendar();
  const weekDates = getWeekDates(selectedDate);
  
  const today = new Date();
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };
  
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };
  
  const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = new Date(event.start).getHours();
    const startMinutes = new Date(event.start).getMinutes();
    
    const top = startHour * 60 + startMinutes;
    
    const endHour = new Date(event.end).getHours();
    const endMinutes = new Date(event.end).getMinutes();
    
    const height = (endHour * 60 + endMinutes) - top;
    
    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };
  
  return (
    <div className="fade-in flex flex-col h-[800px] overflow-y-auto relative bg-white border rounded-lg">
      {/* Header with days */}
      <div className="sticky top-0 bg-white z-10 flex border-b">
        <div className="w-16 flex-shrink-0 border-r"></div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors",
              isToday(date) && "bg-primary/10"
            )}
            onClick={() => handleDateClick(date)}
          >
            <div className="text-sm font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className={cn(
              "inline-block rounded-full w-8 h-8 mt-1 flex items-center justify-center text-sm",
              isToday(date) ? "bg-primary text-white" : ""
            )}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="flex flex-1">
        {/* Time labels */}
        <div className="w-16 flex-shrink-0 border-r">
          {HOURS.map((hour) => (
            <div key={hour} className="h-60 border-b relative">
              <span className="absolute -top-3 left-2 text-xs text-muted-foreground">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>
        
        {/* Days columns */}
        {weekDates.map((date, dateIndex) => {
          const dayEvents = getEventsForDay(date);
          
          return (
            <div key={dateIndex} className="flex-1 relative border-r">
              {/* Hour grid lines */}
              {HOURS.map((hour) => (
                <div key={hour} className="h-60 border-b"></div>
              ))}
              
              {/* Events */}
              {dayEvents.map((event) => {
                const style = calculateEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className="absolute rounded-md p-1 left-1 right-1 overflow-hidden shadow-sm cursor-pointer transition-transform hover:translate-x-1"
                    style={{
                      top: style.top,
                      height: style.height,
                      backgroundColor: event.color,
                    }}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <div className="text-white text-xs font-medium truncate">{event.title}</div>
                    {parseInt(style.height) > 30 && (
                      <div className="text-white/80 text-xs">
                        {formatDate(new Date(event.start), 'time')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
