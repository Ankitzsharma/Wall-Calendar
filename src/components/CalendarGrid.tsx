'use client';

import React from 'react';
import { getCalendarDays, isDateInRange, getMonthName, getYear } from '@/utils/dateHelpers';
import DayCell from './DayCell';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarGridProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  hoveredDate: Date | null;
  onDateClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
  notes: any[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  selectedStartDate,
  selectedEndDate,
  hoveredDate,
  onDateClick,
  onMouseEnter,
  onMouseLeave,
  notes,
}) => {
  const days = getCalendarDays(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDaySelectedStart = (date: Date) => selectedStartDate ? date.getTime() === selectedStartDate.getTime() : false;
  const isDaySelectedEnd = (date: Date) => selectedEndDate ? date.getTime() === selectedEndDate.getTime() : false;
  const isDayInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    
    // Use hovered date for visual feedback if end date is not yet selected
    const end = selectedEndDate || hoveredDate;
    if (!end) return false;
    
    return isDateInRange(date, selectedStartDate, end);
  };

  const hasNoteOnDay = (date: Date) => {
    return notes.some(note => {
      if (note.type === 'date' && note.date) {
        return new Date(note.date).toDateString() === date.toDateString();
      }
      if (note.type === 'range' && note.startDate && note.endDate) {
        return isDateInRange(date, new Date(note.startDate), new Date(note.endDate));
      }
      return false;
    });
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 bg-gray-50/50 border-b">
        <div className="flex flex-col">
          <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">
            {getMonthName(currentMonth)}
          </h2>
          <span className="text-gray-500 font-medium tracking-widest uppercase text-sm">
            {getYear(currentMonth)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Week Days Grid */}
      <div className="grid grid-cols-7 border-b bg-gray-50/30">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.toISOString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="grid grid-cols-7 border-b border-r"
        >
          {days.map((day, index) => (
            <DayCell
              key={index}
              date={day.date}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              isWeekend={day.isWeekend}
              isSelectedStart={isDaySelectedStart(day.date)}
              isSelectedEnd={isDaySelectedEnd(day.date)}
              isInRange={isDayInRange(day.date)}
              onClick={onDateClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              hasNote={hasNoteOnDay(day.date)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalendarGrid;
