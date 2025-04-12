
import React from 'react';
import { useCalendar } from '@/contexts/CalendarContext';
import { formatDate } from '@/utils/calendarUtils';
import { CalendarEvent } from '@/types';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DayView: React.FC = () => {
  const { events, selectedDate, setSelectedEvent } = useCalendar();
  
  // Filter events for the selected day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };
  
  const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = new Date(event.start).getHours();
    const startMinutes = new Date(event.start).getMinutes();
    const endHour = new Date(event.end).getHours();
    const endMinutes = new Date(event.end).getMinutes();
    
    const top = startHour * 60 + startMinutes;
    const height = (endHour * 60 + endMinutes) - top;
    
    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };
  
  return (
    <div className="fade-in flex flex-col h-[800px] overflow-y-auto relative bg-white border rounded-lg">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <h3 className="text-lg font-semibold">{formatDate(selectedDate, 'full')}</h3>
      </div>
      
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
        
        {/* Event container */}
        <div className="flex-1 relative">
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
                className="absolute rounded-md p-2 left-1 right-1 overflow-hidden shadow-sm cursor-pointer transition-transform hover:translate-x-1"
                style={{
                  top: style.top,
                  height: style.height,
                  backgroundColor: event.color,
                }}
                onClick={() => handleEventClick(event)}
              >
                <div className="text-white text-sm font-medium">{event.title}</div>
                {parseInt(style.height) > 40 && (
                  <div className="text-white/80 text-xs">
                    {formatDate(new Date(event.start), 'time')} - {formatDate(new Date(event.end), 'time')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
