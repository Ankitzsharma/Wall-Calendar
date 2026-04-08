'use client';

import React, { useState } from 'react';
import { format, isSameMonth } from 'date-fns';
import { Plus, X, Trash2, Calendar, Layout, FileText } from 'lucide-react';
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

  const currentMonthStr = format(currentMonth, 'yyyy-MM');
  
  const currentMonthNotes = notes.filter(note => {
    if (note.type === 'month') return note.month === currentMonthStr;
    if (note.type === 'date' && note.date) return isSameMonth(new Date(note.date), currentMonth);
    if (note.type === 'range' && note.startDate) return isSameMonth(new Date(note.startDate), currentMonth);
    return false;
  });

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
    <div className="w-full lg:w-96 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
        <h3 className="text-xl font-serif font-bold text-gray-800">Journal & Notes</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  {selectedStartDate && selectedEndDate 
                    ? `Range: ${format(selectedStartDate, 'MMM d')} - ${format(selectedEndDate, 'MMM d')}` 
                    : selectedStartDate 
                    ? `Date: ${format(selectedStartDate, 'MMMM d')}` 
                    : `Month: ${format(currentMonth, 'MMMM yyyy')}`}
                </span>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?..."
                className="w-full h-24 p-3 bg-white border border-blue-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
              <button
                onClick={handleAddNote}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md active:scale-95"
              >
                Save Entry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {currentMonthNotes.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 py-10">
            <FileText className="w-12 h-12 opacity-20" />
            <p className="text-sm font-serif italic text-center">No entries for this month yet.<br />Capture your thoughts above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMonthNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    {note.type === 'month' ? (
                      <Layout className="w-3 h-3 text-orange-400" />
                    ) : (
                      <Calendar className="w-3 h-3 text-blue-400" />
                    )}
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {note.type === 'range' 
                        ? `${format(new Date(note.startDate!), 'MMM d')} - ${format(new Date(note.endDate!), 'MMM d')}` 
                        : note.type === 'date' 
                        ? format(new Date(note.date!), 'MMMM d') 
                        : 'Whole Month'}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-300 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;
