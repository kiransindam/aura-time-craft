
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from '@/utils/calendarUtils';
import { useCalendar } from '@/contexts/CalendarContext';

const CalendarNavigation: React.FC = () => {
  const { 
    selectedDate, 
    setSelectedDate, 
    currentView, 
    setCurrentView 
  } = useCalendar();

  const navigatePrevious = () => {
    const newDate = new Date(selectedDate);
    
    if (currentView === 'day') {
      newDate.setDate(selectedDate.getDate() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(selectedDate.getDate() - 7);
    } else {
      newDate.setMonth(selectedDate.getMonth() - 1);
    }
    
    setSelectedDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(selectedDate);
    
    if (currentView === 'day') {
      newDate.setDate(selectedDate.getDate() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(selectedDate.getDate() + 7);
    } else {
      newDate.setMonth(selectedDate.getMonth() + 1);
    }
    
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getDisplayDate = (): string => {
    if (currentView === 'day') {
      return formatDate(selectedDate, 'full');
    } else if (currentView === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const monthStart = weekStart.getMonth();
      const monthEnd = weekEnd.getMonth();
      
      if (monthStart === monthEnd) {
        return `${weekStart.toLocaleDateString('en-US', { month: 'long' })} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      } else {
        return `${weekStart.toLocaleDateString('en-US', { month: 'short' })} ${weekStart.getDate()} - ${weekEnd.toLocaleDateString('en-US', { month: 'short' })} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
      }
    } else {
      return `${selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
  };

  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={goToToday}
          className="hover:bg-primary/10"
        >
          Today
        </Button>
        
        <Button variant="ghost" size="icon" onClick={navigatePrevious}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={navigateNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {getDisplayDate()}
        </h2>
      </div>
      
      <div className="flex bg-muted rounded-lg p-1">
        <Button 
          variant={currentView === 'day' ? 'default' : 'ghost'} 
          onClick={() => handleViewChange('day')}
          className="rounded-md"
          size="sm"
        >
          Day
        </Button>
        <Button 
          variant={currentView === 'week' ? 'default' : 'ghost'} 
          onClick={() => handleViewChange('week')}
          className="rounded-md"
          size="sm"
        >
          Week
        </Button>
        <Button 
          variant={currentView === 'month' ? 'default' : 'ghost'} 
          onClick={() => handleViewChange('month')}
          className="rounded-md"
          size="sm"
        >
          Month
        </Button>
      </div>
    </div>
  );
};

export default CalendarNavigation;
