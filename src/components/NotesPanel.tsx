'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { Plus, X, Trash2, Calendar, Layout, FileText, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  type: 'date' | 'range' | 'month';
  content: string;
  month?: string;
}

interface NotesPanelProps {
  currentMonth: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id'>) => void;
  onDeleteNote: (id: string) => void;
  onClearSelection: () => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  currentMonth,
  selectedStartDate,
  selectedEndDate,
  notes,
  onAddNote,
  onDeleteNote,
  onClearSelection,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentMonthStr = format(currentMonth, 'yyyy-MM');

  // Filter notes based on current month AND search query
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (note.type === 'month') return note.month === currentMonthStr;
      if (note.type === 'date' && note.date) return isSameMonth(new Date(note.date), currentMonth);
      if (note.type === 'range' && note.startDate) return isSameMonth(new Date(note.startDate), currentMonth);
      return false;
    });
  }, [notes, currentMonthStr, currentMonth, searchQuery]);

  // Highlight notes that match the current selection
  const isNoteSelected = (note: Note) => {
    if (!selectedStartDate) return false;

    if (note.type === 'date' && note.date) {
      return isSameDay(new Date(note.date), selectedStartDate);
    }
    if (note.type === 'range' && note.startDate && note.endDate && selectedEndDate) {
      return isSameDay(new Date(note.startDate), selectedStartDate) &&
        isSameDay(new Date(note.endDate), selectedEndDate);
    }
    return false;
  };

  // Scroll to selected note
  useEffect(() => {
    if (selectedStartDate) {
      const selectedNote = filteredNotes.find(isNoteSelected);
      if (selectedNote) {
        const element = document.getElementById(`note-${selectedNote.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedStartDate, selectedEndDate, filteredNotes]);

  const handleAddNote = () => {
    if (!content.trim()) return;

    if (selectedStartDate && selectedEndDate) {
      onAddNote({
        type: 'range',
        startDate: selectedStartDate.toISOString(),
        endDate: selectedEndDate.toISOString(),
        content: content.trim(),
      });
    } else if (selectedStartDate) {
      onAddNote({
        type: 'date',
        date: selectedStartDate.toISOString(),
        content: content.trim(),
      });
    } else {
      onAddNote({
        type: 'month',
        month: currentMonthStr,
        content: content.trim(),
      });
    }

    setContent('');
    setIsAdding(false);
    onClearSelection();
  };

  return (
    <div className="w-full flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/20 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <FileText className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-black text-gray-900">Journal</h3>
              <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                {format(currentMonth, 'MMMM yyyy')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0">
        <div className="space-y-6">
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                className="bg-blue-600 p-5 rounded-2xl shadow-xl shadow-blue-50 space-y-4"
              >
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 opacity-70" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                      {selectedStartDate && selectedEndDate
                        ? `${format(selectedStartDate, 'MMM d')} - ${format(selectedEndDate, 'MMM d')}`
                        : selectedStartDate
                          ? format(selectedStartDate, 'MMMM d')
                          : format(currentMonth, 'MMMM')}
                    </span>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full h-24 p-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all resize-none"
                  autoFocus
                />
                <button
                  onClick={handleAddNote}
                  className="w-full py-2 bg-white text-blue-600 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-lg active:scale-95"
                >
                  Save Entry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredNotes.length === 0 && !isAdding ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-300 space-y-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <Layout className="w-6 h-6 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-serif italic text-gray-400">
                  {searchQuery ? 'No matches found.' : 'No entries yet.'}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="mt-2 text-[8px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                  >
                    Add note
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  id={`note-${note.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "group relative p-4 rounded-xl border transition-all duration-300",
                    isNoteSelected(note)
                      ? "bg-orange-50/50 border-orange-200 shadow-md ring-1 ring-orange-200/50"
                      : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1 rounded-md",
                        note.type === 'month' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {note.type === 'month' ? <Layout className="w-2.5 h-2.5" /> : <Calendar className="w-2.5 h-2.5" />}
                      </div>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        {note.type === 'range'
                          ? `${format(new Date(note.startDate!), 'MMM d')} - ${format(new Date(note.endDate!), 'MMM d')}`
                          : note.type === 'date'
                            ? format(new Date(note.date!), 'MMM d')
                            : `Whole of ${format(currentMonth, 'MMM')}`}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-relaxed font-medium">
                    {note.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-5 bg-gray-50/50 border-t shrink-0">
        <div className="flex items-center justify-between text-[8px] font-black text-gray-400 uppercase tracking-widest">
          <span>{filteredNotes.length} Entries</span>
          <span>{format(currentMonth, 'MMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

// Utility function for conditional classes
export default NotesPanel;
