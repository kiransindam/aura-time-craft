
import React from 'react';
import { Bell, Calendar, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendar } from '@/contexts/CalendarContext';

const Header: React.FC = () => {
  const { setSelectedEvent } = useCalendar();
  
  const handleNewEvent = () => {
    setSelectedEvent({ id: 'new-event', title: '', start: new Date(), end: new Date(), color: '#4285F4' });
  };
  
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AuraTimeCraft</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <Button onClick={handleNewEvent} className="gap-1">
            <Plus className="h-4 w-4" /> New Event
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
