// components/student/activity-table.tsx
'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MessageSquareWarning } from 'lucide-react';

type Activity = {
  id: string;
  title: string;
  category: string;
  submissionDate: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  feedback: string | null;
};

const StatusBadge = ({ status }: { status: Activity['status'] }) => {
  return (
    <div className={cn('px-2 py-1 text-xs font-medium rounded-full inline-block text-center min-w-[80px]', { 'bg-green-100 text-green-800': status === 'APPROVED', 'bg-yellow-100 text-yellow-800': status === 'PENDING', 'bg-red-100 text-red-800': status === 'REJECTED' })}>
      {status}
    </div>
  );
};

export function ActivityTable({ data }: { data: Activity[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(activity => activity.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center"><Input placeholder="Search by activity title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
        <div className="rounded-md border">
          <Table>
            <TableHeader><TableRow><TableHead>Activity Title</TableHead><TableHead>Category</TableHead><TableHead>Submission Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.category}</TableCell>
                    <TableCell>{activity.submissionDate}</TableCell>
                    <TableCell><StatusBadge status={activity.status} /></TableCell>
                    <TableCell className="text-right">
                      {activity.status === 'REJECTED' && (
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild><AlertDialogTrigger asChild><Button variant="outline" size="icon"><MessageSquareWarning className="h-4 w-4" /></Button></AlertDialogTrigger></TooltipTrigger>
                            <TooltipContent><p>View Feedback</p></TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Faculty Feedback</AlertDialogTitle><AlertDialogDescription>{activity.feedback || "No feedback provided."}</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogAction>Close</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No activities found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}