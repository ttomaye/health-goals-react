
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailyEntry, UserGoals, ChartPeriod } from '@/types';
import { getRecentDates, formatDateShort } from '@/utils/dateUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressChartsProps {
  entries: DailyEntry[];
  goals: UserGoals;
  period: ChartPeriod;
}

const prepareWeightData = (entries: DailyEntry[], recentDates: string[]) => {
  return recentDates.map(date => {
    const entry = entries.find(e => e.date === date);
    return {
      date,
      weight: entry?.weight || null
    };
  }).filter(item => item.weight !== null);
};

const prepareStepsData = (entries: DailyEntry[], recentDates: string[], goal: number) => {
  return recentDates.map(date => {
    const entry = entries.find(e => e.date === date);
    return {
      date,
      steps: entry?.steps || 0,
      goal
    };
  });
};

const prepareWaterData = (entries: DailyEntry[], recentDates: string[], goal: number) => {
  return recentDates.map(date => {
    const entry = entries.find(e => e.date === date);
    return {
      date,
      water: entry?.water || 0,
      goal
    };
  });
};

const ProgressCharts: React.FC<ProgressChartsProps> = ({ entries, goals, period }) => {
  const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
  const recentDates = getRecentDates(days);
  
  const weightData = prepareWeightData(entries, recentDates);
  const stepsData = prepareStepsData(entries, recentDates, goals.dailySteps);
  const waterData = prepareWaterData(entries, recentDates, goals.dailyWater);

  return (
    <div className="space-y-6">
      {/* Weight Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Weight Trend</CardTitle>
          <CardDescription>
            {goals.targetWeight ? `Target: ${goals.targetWeight} lbs` : 'Set a target weight in goals'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => formatDateShort(date)} 
                    fontSize={12}
                  />
                  <YAxis domain={['auto', 'auto']} fontSize={12} />
                  <Tooltip 
                    labelFormatter={(date) => formatDateShort(date)}
                    formatter={(value: number) => [`${value} lbs`, 'Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#9b87f5" 
                    strokeWidth={2}
                    activeDot={{ r: 8, fill: "#7E69AB" }} 
                  />
                  {goals.targetWeight && (
                    <Line 
                      type="monotone" 
                      dataKey={() => goals.targetWeight} 
                      stroke="#F97316" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No weight data available for this period
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Steps Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Daily Steps</CardTitle>
          <CardDescription>Goal: {goals.dailySteps.toLocaleString()} steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => formatDateShort(date)} 
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(date) => formatDateShort(date)}
                  formatter={(value: number) => [`${value.toLocaleString()} steps`, 'Steps']}
                />
                <Bar dataKey="steps" name="Steps" radius={[4, 4, 0, 0]}>
                  {stepsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.steps >= goals.dailySteps ? '#0EA5E9' : '#9b87f5'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Water Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Water Intake</CardTitle>
          <CardDescription>Goal: {goals.dailyWater} cups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => formatDateShort(date)} 
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(date) => formatDateShort(date)}
                  formatter={(value: number) => [`${value} cups`, 'Water']}
                />
                <Bar dataKey="water" name="Water" radius={[4, 4, 0, 0]}>
                  {waterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.water >= goals.dailyWater ? '#8B5CF6' : '#D6BCFA'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCharts;
