
import { format, parseISO, startOfDay, subDays } from 'date-fns';

// Format date as YYYY-MM-DD
export const formatDateForStorage = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format date as "May 18, 2025"
export const formatDateForDisplay = (dateString: string): string => {
  return format(parseISO(dateString), 'MMMM d, yyyy');
};

// Format date as "May 18" (short)
export const formatDateShort = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d');
};

// Get today's date as YYYY-MM-DD
export const getTodayFormatted = (): string => {
  return formatDateForStorage(new Date());
};

// Get an array of recent dates (for charts)
export const getRecentDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = startOfDay(new Date());
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    dates.push(formatDateForStorage(date));
  }
  
  return dates;
};

// Sort dates in ascending order
export const sortDatesAscending = (dates: string[]): string[] => {
  return [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};
