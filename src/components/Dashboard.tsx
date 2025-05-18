
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressCharts from './ProgressCharts';
import MotivationalMessage from './MotivationalMessage';
import { DailyEntry, MotivationalMessage as MotivationalMessageType, UserGoals } from '@/types';
import { generateMotivationalMessages } from '@/utils/motivationUtils';

interface DashboardProps {
  entries: DailyEntry[];
  goals: UserGoals;
  todayEntry: DailyEntry;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, goals, todayEntry }) => {
  const [chartPeriod, setChartPeriod] = useState<'7days' | '30days' | '90days'>('7days');
  
  // Generate motivational messages
  const messages: MotivationalMessageType[] = generateMotivationalMessages(
    todayEntry,
    entries.filter(entry => entry.id !== todayEntry.id),
    goals
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <MotivationalMessage messages={messages} />
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setChartPeriod('7days')}
              className={`px-3 py-1 text-sm rounded-full ${
                chartPeriod === '7days' 
                  ? 'bg-fitPurple text-white' 
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartPeriod('30days')}
              className={`px-3 py-1 text-sm rounded-full ${
                chartPeriod === '30days' 
                  ? 'bg-fitPurple text-white' 
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setChartPeriod('90days')}
              className={`px-3 py-1 text-sm rounded-full ${
                chartPeriod === '90days' 
                  ? 'bg-fitPurple text-white' 
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              90 Days
            </button>
          </div>
          <ProgressCharts 
            entries={entries} 
            goals={goals}
            period={chartPeriod}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
