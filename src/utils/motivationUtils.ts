
import { DailyEntry, MotivationalMessage, UserGoals } from '../types';

export const generateMotivationalMessages = (
  todayEntry: DailyEntry,
  previousEntries: DailyEntry[],
  goals: UserGoals
): MotivationalMessage[] => {
  const messages: MotivationalMessage[] = [];

  // Check if today's entry has data
  if (!todayEntry.steps && !todayEntry.water && !todayEntry.weight) {
    return [{
      type: 'general',
      message: 'Enter today\'s data to track your progress!',
      achieved: false
    }];
  }

  // Steps goal message
  if (todayEntry.steps !== null) {
    if (todayEntry.steps >= goals.dailySteps) {
      messages.push({
        type: 'steps',
        message: `Amazing! You've reached your daily step goal of ${goals.dailySteps.toLocaleString()} steps!`,
        achieved: true
      });
    } else {
      const stepsLeft = goals.dailySteps - todayEntry.steps;
      messages.push({
        type: 'steps',
        message: `${stepsLeft.toLocaleString()} more steps to reach your daily goal!`,
        achieved: false
      });
    }
  }

  // Water intake goal message
  if (todayEntry.water !== null) {
    if (todayEntry.water >= goals.dailyWater) {
      messages.push({
        type: 'water',
        message: `Well done! You've reached your water intake goal of ${goals.dailyWater} cups!`,
        achieved: true
      });
    } else {
      const cupsLeft = goals.dailyWater - todayEntry.water;
      messages.push({
        type: 'water',
        message: `Remember to drink ${cupsLeft} more cup${cupsLeft !== 1 ? 's' : ''} of water today!`,
        achieved: false
      });
    }
  }

  // Weight progress message
  if (todayEntry.weight !== null && goals.targetWeight !== null) {
    const weightDifference = todayEntry.weight - goals.targetWeight;
    
    if (Math.abs(weightDifference) < 0.5) {
      messages.push({
        type: 'weight',
        message: 'Congratulations! You\'ve reached your target weight!',
        achieved: true
      });
    } else if (weightDifference > 0) {
      messages.push({
        type: 'weight',
        message: `You're ${weightDifference.toFixed(1)} lbs away from your target weight!`,
        achieved: false
      });
    } else {
      messages.push({
        type: 'weight',
        message: `You're ${Math.abs(weightDifference).toFixed(1)} lbs below your target weight!`,
        achieved: true
      });
    }
  }

  // Check for progress compared to last entry
  if (previousEntries.length > 0 && todayEntry.weight !== null) {
    // Sort entries by date, most recent first
    const sortedEntries = [...previousEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Find the most recent entry with weight data
    const lastWeightEntry = sortedEntries.find(entry => entry.weight !== null && entry.date !== todayEntry.date);
    
    if (lastWeightEntry && lastWeightEntry.weight !== null) {
      const weightChange = todayEntry.weight - lastWeightEntry.weight;
      
      if (Math.abs(weightChange) >= 0.5) {
        if ((goals.targetWeight === null) || 
            (goals.targetWeight < lastWeightEntry.weight && weightChange < 0) ||
            (goals.targetWeight > lastWeightEntry.weight && weightChange > 0)) {
          messages.push({
            type: 'weight',
            message: `You're making progress! ${Math.abs(weightChange).toFixed(1)} lbs ${weightChange < 0 ? 'lost' : 'gained'} since your last entry.`,
            achieved: true
          });
        }
      }
    }
  }

  // If no specific messages, add a general one
  if (messages.length === 0) {
    messages.push({
      type: 'general',
      message: 'Keep tracking your progress to achieve your fitness goals!',
      achieved: false
    });
  }

  return messages;
};
