
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';
import { DailyEntry } from '@/types';
import { formatDateForStorage, getTodayFormatted, formatDateForDisplay } from '@/utils/dateUtils';
import { saveDailyEntry, getTodayEntry, getEntryByDate } from '@/utils/storageUtils';
import { toast } from 'sonner';

interface DailyEntryFormProps {
  onEntryUpdated: () => void;
}

const DailyEntryForm: React.FC<DailyEntryFormProps> = ({ onEntryUpdated }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>(getTodayFormatted());
  const [entry, setEntry] = useState<DailyEntry>(getTodayEntry());
  
  // Update entry when date changes
  useEffect(() => {
    const newFormattedDate = formatDateForStorage(date);
    setFormattedDate(newFormattedDate);
    
    const existingEntry = getEntryByDate(newFormattedDate);
    if (existingEntry) {
      setEntry(existingEntry);
    } else {
      setEntry({
        id: crypto.randomUUID(),
        date: newFormattedDate,
        weight: null,
        steps: null,
        water: null,
      });
    }
  }, [date]);

  const handleSave = () => {
    saveDailyEntry(entry);
    onEntryUpdated();
    toast.success("Entry saved successfully");
  };

  const handleWeightChange = (value: string) => {
    const parsedValue = parseFloat(value);
    setEntry(prev => ({
      ...prev,
      weight: isNaN(parsedValue) ? null : parsedValue
    }));
  };

  const handleStepsChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setEntry(prev => ({
      ...prev,
      steps: isNaN(parsedValue) ? null : parsedValue
    }));
  };

  const handleWaterChange = (value: number[]) => {
    setEntry(prev => ({
      ...prev,
      water: value[0]
    }));
  };

  const incrementWater = () => {
    setEntry(prev => ({
      ...prev,
      water: (prev.water || 0) + 1
    }));
  };

  const decrementWater = () => {
    setEntry(prev => ({
      ...prev,
      water: Math.max(0, (prev.water || 0) - 1)
    }));
  };

  const isToday = formattedDate === getTodayFormatted();

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Daily Entry</CardTitle>
          <CardDescription>Track your daily progress</CardDescription>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(date, "MMM d, yyyy")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              disabled={(date) => date > new Date()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="weight" className="block text-sm font-medium">
            Weight (lbs)
          </label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="Enter weight"
            value={entry.weight === null ? '' : entry.weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="steps" className="block text-sm font-medium">
            Steps
          </label>
          <Input
            id="steps"
            type="number"
            min="0"
            placeholder="Enter steps"
            value={entry.steps === null ? '' : entry.steps}
            onChange={(e) => handleStepsChange(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Water (cups)
          </label>
          <div className="flex items-center gap-4 max-w-xs">
            <button
              type="button"
              onClick={decrementWater}
              className="step-increment"
              aria-label="Decrease water"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <Slider
                value={[entry.water || 0]}
                min={0}
                max={12}
                step={1}
                onValueChange={handleWaterChange}
              />
            </div>
            <button
              type="button"
              onClick={incrementWater}
              className="step-increment"
              aria-label="Increase water"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">
              {entry.water || 0}
            </span>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full md:w-auto mt-4 bg-gradient-to-r from-fitPurple to-fitAccent-purple hover:from-fitPurple-dark hover:to-fitAccent-purple"
        >
          {isToday ? 'Save Today\'s Entry' : `Save Entry for ${formatDateForDisplay(formattedDate)}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyEntryForm;
