'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { format, isSameDay, isWithinInterval } from 'date-fns';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  hasNote?: boolean;
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
  hasNote,
}) => {
  const isSelected = isSelectedStart || isSelectedEnd;

  return (
    <motion.div
      whileHover={{ scale: isCurrentMonth ? 1.05 : 1 }}
      whileTap={{ scale: isCurrentMonth ? 0.95 : 1 }}
      onClick={() => isCurrentMonth && onClick(date)}
      onMouseEnter={() => isCurrentMonth && onMouseEnter(date)}
      onMouseLeave={() => isCurrentMonth && onMouseLeave()}
      className={cn(
        'relative h-16 sm:h-20 md:h-24 border-t border-l flex flex-col items-start p-1 transition-colors cursor-pointer',
        !isCurrentMonth && 'bg-gray-50 text-gray-400 cursor-default',
        isWeekend && isCurrentMonth && 'bg-orange-50/30',
        isInRange && 'bg-blue-100/50',
        isSelectedStart && 'rounded-tl-lg bg-blue-600 text-white z-10',
        isSelectedEnd && 'rounded-br-lg bg-blue-600 text-white z-10',
        isToday && !isSelected && 'border-2 border-blue-500 font-bold text-blue-600'
      )}
    >
      <span className="text-sm font-medium">{format(date, 'd')}</span>
      
      {hasNote && (
        <div className={cn(
          "absolute bottom-1 right-1 w-2 h-2 rounded-full",
          isSelected ? "bg-white" : "bg-blue-500"
        )} />
      )}
      
      {isSelectedStart && (
        <span className="text-[10px] mt-auto uppercase tracking-tighter opacity-80">Start</span>
      )}
      {isSelectedEnd && (
        <span className="text-[10px] mt-auto uppercase tracking-tighter opacity-80 self-end">End</span>
      )}
    </motion.div>
  );
};

export default DayCell;
