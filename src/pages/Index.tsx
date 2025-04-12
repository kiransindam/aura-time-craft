
import React from 'react';
import { CalendarProvider } from '../contexts/CalendarContext';
import Calendar from '../components/Calendar';
import Header from '../components/Header';
import SmartSuggestions from '../components/SmartSuggestions';

const Index = () => {
  return (
    <CalendarProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <SmartSuggestions />
          <Calendar />
        </main>
      </div>
    </CalendarProvider>
  );
};

export default Index;
