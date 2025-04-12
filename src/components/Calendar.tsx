
import React from 'react';
import CalendarNavigation from './CalendarNavigation';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import EventModal from './EventModal';
import { useCalendar } from '@/contexts/CalendarContext';

const Calendar: React.FC = () => {
  const { currentView } = useCalendar();
  
  const renderView = () => {
    switch (currentView) {
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'month':
      default:
        return <MonthView />;
    }
  };
  
  return (
    <div className="space-y-4">
      <CalendarNavigation />
      {renderView()}
      <EventModal />
    </div>
  );
};

export default Calendar;
