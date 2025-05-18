
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DailyEntry } from '@/types';
import { sortDatesAscending } from '@/utils/dateUtils';
import { deleteEntry } from '@/utils/storageUtils';
import { toast } from 'sonner';

interface HistoryViewerProps {
  entries: DailyEntry[];
  onEntriesUpdated: () => void;
}

const HistoryViewer: React.FC<HistoryViewerProps> = ({ entries, onEntriesUpdated }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
      onEntriesUpdated();
      toast.success('Entry deleted successfully');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>History</CardTitle>
            <CardDescription>View and manage your past entries</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSortDirection}
          >
            {sortDirection === 'asc' ? 'Oldest First' : 'Newest First'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No entries yet. Start tracking your progress!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Weight (lbs)</TableHead>
                  <TableHead className="text-right">Steps</TableHead>
                  <TableHead className="text-right">Water (cups)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {format(parseISO(entry.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">{entry.weight || '-'}</TableCell>
                    <TableCell className="text-right">{entry.steps?.toLocaleString() || '-'}</TableCell>
                    <TableCell className="text-right">{entry.water || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryViewer;
