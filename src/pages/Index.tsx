
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DailyEntryForm from '@/components/DailyEntryForm';
import Dashboard from '@/components/Dashboard';
import GoalSettings from '@/components/GoalSettings';
import HistoryViewer from '@/components/HistoryViewer';
import { getAllEntries, getUserGoals, getTodayEntry } from '@/utils/storageUtils';
import { DailyEntry, UserGoals } from '@/types';

const Index = () => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals>({
    dailySteps: 10000,
    dailyWater: 8,
    targetWeight: null,
  });
  const [todayEntry, setTodayEntry] = useState<DailyEntry>(getTodayEntry());

  // Load data from localStorage
  const loadData = () => {
    setEntries(getAllEntries());
    setGoals(getUserGoals());
    setTodayEntry(getTodayEntry());
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container flex-1 py-6 px-4 md:py-8">
        <Tabs defaultValue="dashboard">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="entry">Track</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <TabsContent value="dashboard">
              <Dashboard 
                entries={entries} 
                goals={goals} 
                todayEntry={todayEntry} 
              />
            </TabsContent>
            
            <TabsContent value="entry">
              <DailyEntryForm onEntryUpdated={loadData} />
            </TabsContent>
            
            <TabsContent value="goals">
              <GoalSettings goals={goals} onGoalsUpdated={loadData} />
            </TabsContent>
            
            <TabsContent value="history">
              <HistoryViewer entries={entries} onEntriesUpdated={loadData} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
