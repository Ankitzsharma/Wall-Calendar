'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isInRange: boolean;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  hasNote?: boolean;
  tabIndex?: number;
}

const DayCell: React.FC<DayCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  isWeekend,
  isSelectedStart,
  isSelectedEnd,
  isInRange,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  hasNote,
  tabIndex = 0,
}) => {
  const isSelected = isSelectedStart || isSelectedEnd;

  // Range highlight logic
  const rangeClasses = cn(
    isInRange && 'bg-blue-50/50',
    isSelectedStart && 'bg-blue-600 rounded-l-lg shadow-md z-10',
    isSelectedEnd && 'bg-blue-600 rounded-r-lg shadow-md z-10',
    isSelectedStart && isSelectedEnd && 'rounded-lg'
  );

  return (
    <motion.div
      role="button"
      aria-label={`${format(date, 'MMMM d, yyyy')}${isToday ? ', today' : ''}${hasNote ? ', has note' : ''}`}
      tabIndex={isCurrentMonth ? tabIndex : -1}
      whileHover={isCurrentMonth ? { backgroundColor: 'rgba(59, 130, 246, 0.03)' } : {}}
      onClick={() => isCurrentMonth && onClick(date)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          isCurrentMonth && onClick(date);
        } else {
          onKeyDown?.(e);
        }
      }}
      onMouseEnter={() => isCurrentMonth && onMouseEnter(date)}
      onMouseLeave={() => isCurrentMonth && onMouseLeave()}
      className={cn(
        'relative flex-1 min-h-0 border-r border-b border-gray-100 flex flex-col items-start p-2 transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
        !isCurrentMonth && 'bg-gray-50/30 text-gray-300 cursor-default',
        isWeekend && isCurrentMonth && 'bg-orange-50/10',
        isToday && !isSelected && 'bg-blue-50/30'
      )}
    >
      {/* Selection Background Layer */}
      <div className={cn(
        'absolute inset-y-1 inset-x-0.5 transition-all duration-200',
        rangeClasses
      )} />

      {/* Date Number */}
      <div className="relative z-10 flex items-center justify-center w-6 h-6">
        <span className={cn(
          'text-[10px] font-semibold transition-colors',
          isCurrentMonth ? 'text-gray-900' : 'text-gray-300',
          isSelected && 'text-white',
          isToday && !isSelected && 'text-blue-600 ring-1 ring-blue-600 rounded-full flex items-center justify-center w-5 h-5'
        )}>
          {format(date, 'd')}
        </span>
      </div>

      {/* Note Indicator */}
      {hasNote && !isSelected && (
        <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-orange-400 shadow-sm z-20" />
      )}

      {/* Today Label (Small) */}
      {isToday && isCurrentMonth && !isSelected && (
        <span className="absolute bottom-1.5 left-2 text-[7px] font-black uppercase tracking-widest text-blue-600 opacity-60">
          Today
        </span>
      )}

      {/* Interactive Paper Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
    </motion.div>
  );
};

export default DayCell;
