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
    <div className="h-screen bg-[#FDFCF8] overflow-hidden selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Background Textures */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] -z-10" />

      {/* Main Unified Container */}
      <main className="flex-1 flex flex-col md:p-6 lg:p-8 min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row"
        >
          {/* 1. Left Section: Hero Visual (Desktop Only) */}
          <aside className="hidden lg:flex lg:w-[22%] bg-gray-50/50 border-r border-gray-100 p-8 flex-col gap-8 overflow-y-auto custom-scrollbar">
            {/* Hero Image Card */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-sm translate-x-1.5 translate-y-1.5 -z-10 opacity-40 border border-gray-100" />

              <div className="relative bg-white p-2.5 rounded-2xl shadow-md overflow-hidden border border-gray-100 aspect-[4/5]">
                <div className="relative h-full rounded-xl overflow-hidden shadow-inner">
                  <motion.img
                    src={heroImage}
                    alt="Current Month Visual"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Image Metadata Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white/20 backdrop-blur-md rounded-md">
                        <Camera className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-80 text-white/90 text-nowrap">Collection 2026</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-serif font-black italic leading-tight">Serene<br />Horizons</h1>
                      <div className="flex items-center gap-1.5 mt-2 text-[9px] font-bold opacity-70 tracking-wide">
                        <MapPin className="w-2.5 h-2.5" />
                        Yosemite Valley
                      </div>
                    </div>
                  </div>
                </div>

                {/* Binder Holes */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#FDFCF8] shadow-inner border border-gray-100 relative">
                      <div className="absolute inset-0.5 rounded-full bg-gray-200/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote Section */}
            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-gray-100/50 space-y-4 shrink-0">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
                  <Info className="w-3 h-3 text-orange-600" />
                </div>
                <p className="text-[11px] text-gray-600 font-serif italic leading-relaxed">
                  "In every walk with nature, one receives far more than he seeks."
                  <span className="block mt-2 font-sans font-black text-[8px] uppercase tracking-widest text-gray-400 not-italic">— Ankit Sharma</span>
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-nowrap">Local Time</p>
                  <p className="text-[10px] font-bold text-gray-900">
                    {isMounted ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                </div>
                <button className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-[8px] font-black text-gray-500 uppercase tracking-widest transition-colors group">
                  <Share2 className="w-2.5 h-2.5 group-hover:text-blue-600" />
                  Export
                </button>
              </div>
            </div>

            {/* Decorative Branding */}
            <div className="mt-auto pt-8 flex items-center gap-3 opacity-20">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-[9px] font-black tracking-[0.5em] text-gray-500 uppercase">Ankit Sharma</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
          </aside>

          {/* 2. Center & Right Section (Single Instance) */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
            {/* Calendar Grid */}
            <section className="flex-1 flex flex-col bg-white overflow-hidden border-r border-gray-100 min-h-[500px] lg:min-h-0">
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
            </section>

            {/* Notes Sidebar */}
            <aside className="lg:w-[28%] flex flex-col bg-white overflow-hidden border-t lg:border-t-0 border-gray-100 min-h-[400px] lg:min-h-0">
              <NotesPanel
                currentMonth={currentMonth}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
                notes={notes}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                onClearSelection={clearSelection}
              />
            </aside>
          </div>
        </motion.div>
      </main>

      {/* Decorative Floating Elements */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] aspect-square bg-orange-50/50 rounded-full blur-[120px]" />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
