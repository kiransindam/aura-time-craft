
import React, { useState, useEffect } from 'react';
import { useCalendar } from '@/contexts/CalendarContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/utils/calendarUtils';
import { EventFormData } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from 'lucide-react';

const EventModal: React.FC = () => {
  const { selectedEvent, setSelectedEvent, addEvent, updateEvent, deleteEvent } = useCalendar();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    color: '#4285F4',
    location: '',
    priority: 'medium',
    isAllDay: false
  });

  // Update form when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description || '',
        start: new Date(selectedEvent.start),
        end: new Date(selectedEvent.end),
        color: selectedEvent.color,
        location: selectedEvent.location || '',
        priority: selectedEvent.priority || 'medium',
        isAllDay: selectedEvent.isAllDay || false
      });
    } else {
      // Reset form for new event
      const startDate = new Date();
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);
      
      setFormData({
        title: '',
        description: '',
        start: startDate,
        end: endDate,
        color: '#4285F4',
        location: '',
        priority: 'medium',
        isAllDay: false
      });
    }
  }, [selectedEvent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDate = new Date(value);
    
    if (name === 'startDate') {
      const newStart = new Date(formData.start);
      newStart.setFullYear(newDate.getFullYear());
      newStart.setMonth(newDate.getMonth());
      newStart.setDate(newDate.getDate());
      setFormData(prev => ({ ...prev, start: newStart }));
    } else if (name === 'endDate') {
      const newEnd = new Date(formData.end);
      newEnd.setFullYear(newDate.getFullYear());
      newEnd.setMonth(newDate.getMonth());
      newEnd.setDate(newDate.getDate());
      setFormData(prev => ({ ...prev, end: newEnd }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [hours, minutes] = value.split(':').map(Number);
    
    if (name === 'startTime') {
      const newStart = new Date(formData.start);
      newStart.setHours(hours, minutes);
      setFormData(prev => ({ ...prev, start: newStart }));
    } else if (name === 'endTime') {
      const newEnd = new Date(formData.end);
      newEnd.setHours(hours, minutes);
      setFormData(prev => ({ ...prev, end: newEnd }));
    }
  };

  const handlePriorityChange = (value: string) => {
    const priority = value as 'low' | 'medium' | 'high';
    const colorMap = {
      low: '#8BC34A',
      medium: '#FFC107',
      high: '#FF5722'
    };
    
    setFormData(prev => ({ 
      ...prev, 
      priority, 
      color: colorMap[priority]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEvent) {
      updateEvent(selectedEvent.id, formData);
    } else {
      addEvent(formData);
    }
    
    handleClose();
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <Dialog open={selectedEvent !== null || false} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Add title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formatDateForInput(formData.start)}
                  onChange={handleDateChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formatTimeForInput(formData.start)}
                  onChange={handleTimeChange}
                  disabled={formData.isAllDay}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formatDateForInput(formData.end)}
                  onChange={handleDateChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formatTimeForInput(formData.end)}
                  onChange={handleTimeChange}
                  disabled={formData.isAllDay}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Add location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <RadioGroup 
                value={formData.priority} 
                onValueChange={handlePriorityChange}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="low" id="low" className="border-green-500" />
                  <Label htmlFor="low" className="text-green-600">Low</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="medium" id="medium" className="border-amber-500" />
                  <Label htmlFor="medium" className="text-amber-600">Medium</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="high" id="high" className="border-orange-500" />
                  <Label htmlFor="high" className="text-orange-600">High</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            {selectedEvent && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedEvent ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
