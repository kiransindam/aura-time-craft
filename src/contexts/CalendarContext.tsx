
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CalendarEvent, CalendarView } from '../types';
import { generateMockEvents } from '../utils/calendarUtils';
import { toast } from '@/components/ui/use-toast';

interface CalendarContextType {
  events: CalendarEvent[];
  selectedDate: Date;
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (eventId: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Load mock events on initial render
  useEffect(() => {
    const mockEvents = generateMockEvents(15);
    setEvents(mockEvents);
  }, []);

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    toast({
      title: "Event created",
      description: `"${newEvent.title}" has been added to your calendar.`,
    });
  };

  const updateEvent = (eventId: string, updatedData: Partial<CalendarEvent>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, ...updatedData } 
          : event
      )
    );
    toast({
      title: "Event updated",
      description: "Your event has been updated successfully.",
    });
  };

  const deleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }

    toast({
      title: "Event deleted",
      description: eventToDelete ? `"${eventToDelete.title}" has been removed.` : "Event has been removed.",
      variant: "destructive",
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        selectedDate,
        currentView,
        setCurrentView,
        setSelectedDate,
        addEvent,
        updateEvent,
        deleteEvent,
        selectedEvent,
        setSelectedEvent
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
