
import { CalendarEvent, DateInfo } from "../types";

// Get an array of dates for a month view
export const getMonthDates = (year: number, month: number): Date[] => {
  const result: Date[] = [];
  
  // Get the first day of the month
  const firstDay = new Date(year, month, 1);
  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Add days from the previous month to start the calendar from Sunday
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    result.push(new Date(year, month - 1, prevMonthLastDay - i));
  }
  
  // Add all days of the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    result.push(new Date(year, month, i));
  }
  
  // Add days from the next month to complete the grid (6 rows x 7 days = 42 cells)
  const remainingDays = 42 - result.length;
  for (let i = 1; i <= remainingDays; i++) {
    result.push(new Date(year, month + 1, i));
  }
  
  return result;
};

// Get events for a specific day
export const getEventsForDay = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  return events.filter(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() === month &&
      eventDate.getDate() === day
    );
  });
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Format date to display
export const formatDate = (date: Date, format: string = 'short'): string => {
  if (format === 'full') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  } else if (format === 'time') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

// Get the week dates for a given date
export const getWeekDates = (date: Date): Date[] => {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const result: Date[] = [];
  
  // Calculate the first day of the week (Sunday)
  const firstDayOfWeek = new Date(date);
  firstDayOfWeek.setDate(date.getDate() - day);
  
  // Add all 7 days of the week
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(firstDayOfWeek);
    newDate.setDate(firstDayOfWeek.getDate() + i);
    result.push(newDate);
  }
  
  return result;
};

// Date info helpers
export const getDateInfo = (date: Date): DateInfo => {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate()
  };
};

// Event colors for priority
export const priorityColors = {
  low: '#8BC34A',    // Green
  medium: '#FFC107', // Yellow/Amber
  high: '#FF5722'    // Red/Orange
};

// Smart time suggestion based on event type (simulated AI functionality)
export const suggestTime = (eventTitle: string, existingEvents: CalendarEvent[]): { start: Date, end: Date } => {
  const now = new Date();
  const suggestedStart = new Date(now);
  const suggestedEnd = new Date(now);
  
  // Set default duration to 1 hour
  suggestedEnd.setHours(suggestedStart.getHours() + 1);
  
  // Simple keyword-based time suggestion
  const lowerTitle = eventTitle.toLowerCase();
  
  if (lowerTitle.includes('lunch') || lowerTitle.includes('dinner')) {
    // Suggest lunch around noon, dinner around 6 PM
    if (lowerTitle.includes('lunch')) {
      suggestedStart.setHours(12, 0, 0, 0);
      suggestedEnd.setHours(13, 0, 0, 0);
    } else {
      suggestedStart.setHours(18, 0, 0, 0);
      suggestedEnd.setHours(19, 30, 0, 0);
    }
  } else if (lowerTitle.includes('meeting') || lowerTitle.includes('call')) {
    // For meetings, find a free slot during business hours
    suggestedStart.setHours(9, 0, 0, 0);
    suggestedEnd.setHours(9, 30, 0, 0);
    
    // Check next three business days for a free slot
    for (let day = 0; day < 3; day++) {
      suggestedStart.setDate(now.getDate() + day);
      suggestedEnd.setDate(now.getDate() + day);
      
      // Start from 9 AM
      suggestedStart.setHours(9, 0, 0, 0);
      
      // Try different time slots during the day
      let foundSlot = false;
      
      for (let hour = 9; hour < 17; hour++) {
        suggestedStart.setHours(hour, 0, 0, 0);
        suggestedEnd.setHours(hour + 1, 0, 0, 0);
        
        const conflict = existingEvents.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return (
            (suggestedStart >= eventStart && suggestedStart < eventEnd) ||
            (suggestedEnd > eventStart && suggestedEnd <= eventEnd) ||
            (suggestedStart <= eventStart && suggestedEnd >= eventEnd)
          );
        });
        
        if (!conflict) {
          foundSlot = true;
          break;
        }
      }
      
      if (foundSlot) break;
    }
  } else if (lowerTitle.includes('workout') || lowerTitle.includes('exercise') || lowerTitle.includes('gym')) {
    // Suggest early morning or evening workout
    const currentHour = now.getHours();
    if (currentHour < 10) {
      suggestedStart.setHours(7, 0, 0, 0);
      suggestedEnd.setHours(8, 0, 0, 0);
    } else {
      suggestedStart.setHours(18, 0, 0, 0);
      suggestedEnd.setHours(19, 0, 0, 0);
    }
  }
  
  return { start: suggestedStart, end: suggestedEnd };
};

// Mock function to generate random events for demo
export const generateMockEvents = (numEvents: number = 10): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const eventTitles = [
    "Team Meeting", "Project Review", "Client Call", "Lunch with Mike",
    "Workout", "Doctor's Appointment", "Coffee with Sarah", "Presentation Prep",
    "Dentist", "Weekly Planning", "Brainstorming Session", "Product Demo"
  ];
  
  const locations = [
    "Conference Room A", "Zoom Call", "Coffee Shop", "Office", 
    "Gym", "Medical Center", "Home", "Client Office"
  ];
  
  const priorities = ["low", "medium", "high"] as const;
  const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#9C27B0", "#00ACC1"];
  
  const now = new Date();
  const startMonth = now.getMonth() - 1;
  const endMonth = now.getMonth() + 2;
  
  for (let i = 0; i < numEvents; i++) {
    const randomMonth = startMonth + Math.floor(Math.random() * 3);
    const randomDay = 1 + Math.floor(Math.random() * 28);
    const randomHour = 8 + Math.floor(Math.random() * 10);
    const randomDuration = 30 + Math.floor(Math.random() * 120);
    
    const start = new Date(now.getFullYear(), randomMonth, randomDay, randomHour);
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + randomDuration);
    
    const title = eventTitles[Math.floor(Math.random() * eventTitles.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const color = priority === 'low' 
      ? priorityColors.low 
      : priority === 'medium' 
        ? priorityColors.medium 
        : priorityColors.high;
    
    events.push({
      id: `event-${i}`,
      title,
      description: `Description for ${title}`,
      start,
      end,
      color,
      location: locations[Math.floor(Math.random() * locations.length)],
      priority,
      isAllDay: Math.random() > 0.9 // 10% chance of all-day event
    });
  }
  
  return events;
};
