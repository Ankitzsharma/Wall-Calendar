'use client';

import React from 'react';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { useCalendar } from '@/hooks/useCalendar';
import { motion } from 'framer-motion';
import { Camera, Calendar as CalendarIcon, MapPin, Share2 } from 'lucide-react';

const Calendar: React.FC = () => {
  const {
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
  } = useCalendar();

  // Use a placeholder hero image that looks like a wall calendar photo
  const heroImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-4 md:p-8 lg:p-12 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Wall Calendar Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col lg:flex-row gap-8 bg-white p-6 md:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100"
        >
          {/* Decorative Ring Binder (Mimicking a real wall calendar) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 flex gap-4 z-20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-6 h-12 bg-gradient-to-b from-gray-300 to-gray-100 rounded-full shadow-inner border border-gray-200" />
            ))}
          </div>

          {/* Left Column: Hero Image & Context */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-xl aspect-[4/5] shadow-2xl">
              <motion.img
                src={heroImage}
                alt="Hero"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                  <Camera className="w-3 h-3" />
                  Shot of the Month
                </div>
                <h1 className="text-2xl font-serif font-bold italic">Serene Horizons</h1>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <MapPin className="w-3 h-3" />
                  Yosemite National Park
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-4 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 text-gray-800">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <span className="font-serif font-bold italic">Today is {isMounted ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '...'}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed italic font-serif">
                "Every day is a fresh start, a blank page in your story. Make it count."
              </p>
              <div className="flex gap-4 pt-2">
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-widest">
                  <Share2 className="w-3 h-3" />
                  Share Page
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Calendar Grid */}
          <div className="flex-1 flex flex-col">
            <CalendarGrid
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              hoveredDate={hoveredDate}
              onDateClick={handleDateClick}
              onMouseEnter={setHoveredDate}
              onMouseLeave={() => setHoveredDate(null)}
              notes={notes}
            />
          </div>
        </motion.div>

        {/* Notes Section - Below or Beside depending on screen */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full flex justify-end"
        >
          <NotesPanel
            currentMonth={currentMonth}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            notes={notes}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            onClearSelection={clearSelection}
          />
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-orange-100 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Calendar;
