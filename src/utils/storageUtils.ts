
import { DailyEntry, UserGoals } from '../types';
import { getTodayFormatted } from './dateUtils';

const ENTRIES_STORAGE_KEY = 'fittrack-entries';
const GOALS_STORAGE_KEY = 'fittrack-goals';

// Default goals
const DEFAULT_GOALS: UserGoals = {
  dailySteps: 10000,
  dailyWater: 8,
  targetWeight: null,
};

// Save daily entry to localStorage
export const saveDailyEntry = (entry: DailyEntry): void => {
  const entries = getAllEntries();
  
  // Check if an entry for this date already exists
  const existingEntryIndex = entries.findIndex(e => e.date === entry.date);
  
  if (existingEntryIndex !== -1) {
    // Update existing entry
    entries[existingEntryIndex] = entry;
  } else {
    // Add new entry
    entries.push(entry);
  }
  
  localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
};

// Get all entries from localStorage
export const getAllEntries = (): DailyEntry[] => {
  const entriesJSON = localStorage.getItem(ENTRIES_STORAGE_KEY);
  return entriesJSON ? JSON.parse(entriesJSON) : [];
};

// Get entry for a specific date
export const getEntryByDate = (date: string): DailyEntry | undefined => {
  const entries = getAllEntries();
  return entries.find(entry => entry.date === date);
};

// Get today's entry (or create a new one)
export const getTodayEntry = (): DailyEntry => {
  const today = getTodayFormatted();
  const existingEntry = getEntryByDate(today);
  
  if (existingEntry) {
    return existingEntry;
  }
  
  // Create new entry for today
  return {
    id: crypto.randomUUID(),
    date: today,
    weight: null,
    steps: null,
    water: null,
  };
};

// Delete an entry
export const deleteEntry = (id: string): void => {
  const entries = getAllEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(updatedEntries));
};

// Save user goals
export const saveUserGoals = (goals: UserGoals): void => {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
};

// Get user goals
export const getUserGoals = (): UserGoals => {
  const goalsJSON = localStorage.getItem(GOALS_STORAGE_KEY);
  return goalsJSON ? JSON.parse(goalsJSON) : DEFAULT_GOALS;
};
