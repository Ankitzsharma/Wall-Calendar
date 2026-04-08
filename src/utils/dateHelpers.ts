import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    format,
    addMonths,
    subMonths,
    isWeekend,
} from 'date-fns';

export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
}

export const getCalendarDays = (month: Date): CalendarDay[] => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));

    return eachDayOfInterval({ start, end }).map((date) => ({
        date,
        isCurrentMonth: isSameMonth(date, month),
        isToday: isSameDay(date, new Date()),
        isWeekend: isWeekend(date),
    }));
};

export const formatDate = (date: Date, formatStr: string = 'PPP'): string => {
    return format(date, formatStr);
};

export const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;

    const [actualStart, actualEnd] = start <= end ? [start, end] : [end, start];

    return isWithinInterval(date, { start: actualStart, end: actualEnd });
};

export const getMonthName = (date: Date): string => {
    return format(date, 'MMMM');
};

export const getYear = (date: Date): string => {
    return format(date, 'yyyy');
};

export { addMonths, subMonths, isSameDay };
