
import React from 'react';
import { Weight } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border py-3 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-fitPurple to-fitAccent-purple p-1.5 rounded-lg">
            <Weight className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-fitPurple to-fitAccent-purple text-transparent bg-clip-text">
            FitTrack
          </h1>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Personal Health & Fitness Tracker
        </div>
      </div>
    </header>
  );
};

export default Header;
