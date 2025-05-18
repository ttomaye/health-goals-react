
import React from 'react';
import { Star, CheckCircle, InfoIcon } from "lucide-react";
import { MotivationalMessage as MessageType } from '@/types';

interface MotivationalMessageProps {
  messages: MessageType[];
}

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ messages }) => {
  if (!messages.length) {
    return null;
  }

  const getIcon = (type: string, achieved?: boolean) => {
    if (achieved) {
      return <CheckCircle className="w-5 h-5 text-green-500 animate-celebrate" />;
    }
    
    switch (type) {
      case 'steps':
        return <Star className="w-5 h-5 text-fitAccent-orange" />;
      case 'water':
        return <Star className="w-5 h-5 text-fitAccent-blue" />;
      case 'weight':
        return <Star className="w-5 h-5 text-fitAccent-purple" />;
      default:
        return <InfoIcon className="w-5 h-5 text-fitPurple" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {messages.map((message, index) => (
        <div 
          key={index}
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.achieved 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
              : 'bg-white border border-fitPurple-light/30'
          }`}
        >
          <div className="mt-0.5">
            {getIcon(message.type, message.achieved)}
          </div>
          <p className="text-sm">{message.message}</p>
        </div>
      ))}
    </div>
  );
};

export default MotivationalMessage;
