
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowRight, Calendar, Clock } from 'lucide-react';
import { suggestTime } from '@/utils/calendarUtils';
import { useCalendar } from '@/contexts/CalendarContext';
import { formatDate } from '@/utils/calendarUtils';

const SmartSuggestions: React.FC = () => {
  const { events, setSelectedEvent } = useCalendar();
  const [eventTitle, setEventTitle] = useState('');
  const [suggestion, setSuggestion] = useState<{ start: Date; end: Date } | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventTitle(e.target.value);
  };
  
  const handleSuggest = () => {
    if (eventTitle.trim()) {
      const suggestedTime = suggestTime(eventTitle, events);
      setSuggestion(suggestedTime);
    }
  };
  
  const handleCreateEvent = () => {
    if (eventTitle && suggestion) {
      setSelectedEvent({
        id: 'new-event',
        title: eventTitle,
        start: suggestion.start,
        end: suggestion.end,
        color: '#4285F4',
      });
      
      // Reset
      setEventTitle('');
      setSuggestion(null);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Smart Event Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="What would you like to schedule?"
              value={eventTitle}
              onChange={handleInputChange}
              className="flex-1"
            />
            <Button onClick={handleSuggest} disabled={!eventTitle.trim()}>
              Suggest
            </Button>
          </div>
          
          {suggestion && (
            <div className="bg-muted p-4 rounded-lg slide-up">
              <h4 className="font-medium mb-2">AI Suggestion for "{eventTitle}"</h4>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(suggestion.start, 'full')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {formatDate(suggestion.start, 'time')} - {formatDate(suggestion.end, 'time')}
                  </span>
                </div>
              </div>
              <Button className="w-full" onClick={handleCreateEvent}>
                Create Event <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
