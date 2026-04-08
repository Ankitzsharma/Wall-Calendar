'use client';

import React from 'react';
import { getCalendarDays, isDateInRange, getMonthName, getYear } from '@/utils/dateHelpers';
import DayCell from './DayCell';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

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

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent, date: Date, index: number) => {
    let newIndex = -1;
    switch (e.key) {
      case 'ArrowRight': newIndex = index + 1; break;
      case 'ArrowLeft': newIndex = index - 1; break;
      case 'ArrowDown': newIndex = index + 7; break;
      case 'ArrowUp': newIndex = index - 7; break;
      default: return;
    }

    if (newIndex >= 0 && newIndex < days.length) {
      const nextDate = days[newIndex].date;
      const nextElement = document.querySelector(`[aria-label*="${format(nextDate, 'MMMM d, yyyy')}"]`) as HTMLElement;
      nextElement?.focus();
    }
  };

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
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-serif font-black text-gray-900 tracking-tight leading-none">
              {getMonthName(currentMonth)}
            </h2>
            <span className="text-[9px] text-gray-400 font-black tracking-[0.2em] uppercase mt-0.5">
              {getYear(currentMonth)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg hover:bg-white hover:text-blue-600 transition-all active:scale-90 group"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </button>
          <div className="w-px h-3 bg-gray-200 mx-1" />
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg hover:bg-white hover:text-blue-600 transition-all active:scale-90 group"
            aria-label="Next Month"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100 shrink-0">
        {weekDays.map((day) => (
          <div key={day} className="py-2.5 text-center text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid Container */}
      <div className="flex-1 relative overflow-hidden bg-white min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentMonth.toISOString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-7 auto-rows-fr border-l border-t border-gray-100 h-full"
          >
            {days.map((day, index) => (
              <DayCell
                key={`${currentMonth.toISOString()}-${index}`}
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
                onKeyDown={(e) => handleKeyDown(e as any, day.date, index)}
                hasNote={hasNoteOnDay(day.date)}
                tabIndex={index + 1}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="px-8 py-2.5 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center text-[8px] text-gray-400 font-black uppercase tracking-widest shrink-0">
        <span>Select a date or range</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-sm bg-blue-600" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>Journal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
