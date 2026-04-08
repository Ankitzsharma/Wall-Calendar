import { useState, useEffect, useCallback } from 'react';
import { addMonths, subMonths, isSameDay } from '@/utils/dateHelpers';

export interface Note {
  id: string;
  date?: string; // ISO string for single date
  startDate?: string; // ISO string for range
  endDate?: string; // ISO string for range
  type: 'date' | 'range' | 'month';
  content: string;
  month?: string; // YYYY-MM
}

export const useCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const savedNotes = localStorage.getItem('wall-calendar-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('wall-calendar-notes', JSON.stringify(notes));
  }, [notes]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = useCallback((date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      // Handle reverse selection: if clicked date is before start date, swap them
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
    }
  }, [selectedStartDate, selectedEndDate]);

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const clearSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  return {
    isMounted,
    currentMonth,
    selectedStartDate,
    selectedEndDate,
    hoveredDate,
    notes,
    setHoveredDate,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    addNote,
    deleteNote,
    clearSelection,
  };
};
