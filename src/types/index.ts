
export interface DailyEntry {
  id: string;
  date: string;
  weight: number | null;
  steps: number | null;
  water: number | null;
}

export interface UserGoals {
  dailySteps: number;
  dailyWater: number;
  targetWeight: number | null;
}

export interface MotivationalMessage {
  type: 'steps' | 'water' | 'weight' | 'general';
  message: string;
  achieved?: boolean;
}

export type ChartPeriod = '7days' | '30days' | '90days' | 'all';
