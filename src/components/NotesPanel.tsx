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
    <div className="w-full bg-white flex flex-col min-h-[400px] max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/20 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-orange-100 rounded-xl">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-black text-gray-900">Journal Entries</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
              {format(currentMonth, 'MMMM yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                className="bg-blue-600 p-8 rounded-2xl shadow-xl shadow-blue-50 space-y-6"
              >
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 opacity-70" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {selectedStartDate && selectedEndDate
                        ? `Range: ${format(selectedStartDate, 'MMM d')} - ${format(selectedEndDate, 'MMM d')}`
                        : selectedStartDate
                          ? `Date: ${format(selectedStartDate, 'MMMM d')}`
                          : `Month: ${format(currentMonth, 'MMMM')}`}
                    </span>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all resize-none"
                  autoFocus
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddNote}
                    className="px-8 py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-lg active:scale-95"
                  >
                    Save Entry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredNotes.length === 0 && !isAdding ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300 space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Layout className="w-8 h-8 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-sm font-serif italic text-gray-400">
                  {searchQuery ? 'No matches found.' : 'No entries for this period yet.'}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                  >
                    Add your first note
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  id={`note-${note.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "group relative p-6 rounded-2xl border transition-all duration-300",
                    isNoteSelected(note)
                      ? "bg-orange-50/50 border-orange-200 shadow-md ring-1 ring-orange-200/50"
                      : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        note.type === 'month' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {note.type === 'month' ? <Layout className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {note.type === 'range'
                          ? `${format(new Date(note.startDate!), 'MMM d')} - ${format(new Date(note.endDate!), 'MMM d')}`
                          : note.type === 'date'
                            ? format(new Date(note.date!), 'MMMM d')
                            : `Whole of ${format(currentMonth, 'MMMM')}`}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    {note.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-gray-50/50 border-t">
        <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <span>{filteredNotes.length} Entries</span>
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

// Utility function for conditional classes
export default NotesPanel;
