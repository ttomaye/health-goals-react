
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { UserGoals } from '@/types';
import { saveUserGoals } from '@/utils/storageUtils';
import { toast } from 'sonner';

interface GoalSettingsProps {
  goals: UserGoals;
  onGoalsUpdated: () => void;
}

const GoalSettings: React.FC<GoalSettingsProps> = ({ goals, onGoalsUpdated }) => {
  const [dailySteps, setDailySteps] = useState<number>(goals.dailySteps);
  const [dailyWater, setDailyWater] = useState<number>(goals.dailyWater);
  const [targetWeight, setTargetWeight] = useState<number | null>(goals.targetWeight);

  const handleSave = () => {
    const updatedGoals: UserGoals = {
      dailySteps,
      dailyWater,
      targetWeight
    };
    
    saveUserGoals(updatedGoals);
    onGoalsUpdated();
    toast.success('Goals updated successfully');
  };

  const handleTargetWeightChange = (value: string) => {
    const parsedValue = parseFloat(value);
    setTargetWeight(value === '' ? null : isNaN(parsedValue) ? null : parsedValue);
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Goal Settings</CardTitle>
        <CardDescription>Set your personal health and fitness goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Daily Steps Goal: {dailySteps.toLocaleString()} steps
            </label>
            <Slider 
              value={[dailySteps]} 
              min={1000} 
              max={30000} 
              step={500} 
              onValueChange={(values) => setDailySteps(values[0])} 
              className="max-w-md"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1 max-w-md">
              <span>1,000</span>
              <span>15,000</span>
              <span>30,000</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Daily Water Goal: {dailyWater} cups
            </label>
            <Slider 
              value={[dailyWater]} 
              min={1} 
              max={16} 
              step={1} 
              onValueChange={(values) => setDailyWater(values[0])} 
              className="max-w-md"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1 max-w-md">
              <span>1</span>
              <span>8</span>
              <span>16</span>
            </div>
          </div>

          <div className="pt-2">
            <label htmlFor="targetWeight" className="block text-sm font-medium mb-2">
              Target Weight (lbs)
            </label>
            <Input
              id="targetWeight"
              type="number"
              step="0.1"
              placeholder="Enter target weight"
              value={targetWeight === null ? '' : targetWeight}
              onChange={(e) => handleTargetWeightChange(e.target.value)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank if you don't want to track weight goals
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSave}
          className="mt-6 bg-gradient-to-r from-fitPurple to-fitAccent-purple hover:from-fitPurple-dark hover:to-fitAccent-purple"
        >
          Save Goals
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalSettings;
