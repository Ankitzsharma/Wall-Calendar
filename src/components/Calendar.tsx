'use client';

import React from 'react';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { useCalendar } from '@/hooks/useCalendar';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { Camera, MapPin, Share2, Info } from 'lucide-react';

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

  const heroImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-4 md:p-8 lg:p-12 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Background Textures */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Unified Wall Calendar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col"
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
            
            {/* Left Section: Hero Image (Desktop) / Second Section (Mobile) */}
            <div className="order-2 lg:order-1 bg-gray-50/50 border-r border-gray-100 p-6 lg:p-8 flex flex-col gap-8">
              {/* Hero Image Card */}
              <div className="relative group flex-1 min-h-[400px]">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-sm translate-x-2 translate-y-2 -z-10 opacity-40 border border-gray-100" />
                
                <div className="h-full relative bg-white p-3 rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                  <div className="relative flex-1 rounded-xl overflow-hidden shadow-inner">
                    <motion.img
                      src={heroImage}
                      alt="Current Month Visual"
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Image Metadata Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                          <Camera className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80 text-white/90">Collection 2026</span>
                      </div>
                      <div>
                        <h1 className="text-3xl font-serif font-black italic leading-tight">Serene<br />Horizons</h1>
                        <div className="flex items-center gap-2 mt-3 text-[11px] font-bold opacity-70 tracking-wide">
                          <MapPin className="w-3 h-3" />
                          Yosemite Valley, California
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Binder Holes */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-[#FDFCF8] shadow-inner border border-gray-100 relative">
                        <div className="absolute inset-0.5 rounded-full bg-gray-200/40" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quote Section */}
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100/50 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
                    <Info className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-serif italic leading-relaxed">
                    "In every walk with nature, one receives far more than he seeks."
                    <span className="block mt-2 font-sans font-black text-[9px] uppercase tracking-widest text-gray-400 not-italic">— John Muir</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Local Time</p>
                    <p className="text-xs font-bold text-gray-900">
                      {isMounted ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest transition-colors group">
                    <Share2 className="w-3 h-3 group-hover:text-blue-600" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section: Calendar (Desktop) / First Section (Mobile) */}
            <div className="order-1 lg:order-2 flex flex-col bg-white">
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
          </div>

          {/* Bottom Section: Notes Panel */}
          <div className="border-t border-gray-100">
            <NotesPanel
              currentMonth={currentMonth}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              notes={notes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
              onClearSelection={clearSelection}
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] aspect-square bg-orange-50/50 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default Calendar;
