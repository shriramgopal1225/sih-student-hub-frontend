// components/faculty/verification-queue.tsx
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { approveActivity, rejectActivity } from '@/app/(platform)/faculty/verification/actions';
import Link from 'next/link';

// Updated type definition to match the new query structure
type ActivityWithDetails = {
  activity_id: string;
  title: string;
  description: string | null;
  created_at: string;
  credits_earned: number;
  student_id: string;
  students: {
    profiles: {
      full_name: string | null;
    } | null;
  } | null;
  activity_categories: { name: string; } | null;
  activity_proofs: { file_url: string; }[];
};

export function VerificationQueue({ activities }: { activities: ActivityWithDetails[] }) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithDetails | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!selectedActivity) return;
    setIsSubmitting(true);
    await approveActivity(selectedActivity.activity_id, selectedActivity.student_id, selectedActivity.credits_earned);
    setIsSubmitting(false);
    setSelectedActivity(null);
  };

  const handleReject = async () => {
    if (!selectedActivity || !feedback) {
      alert("Feedback is required for rejection.");
      return;
    }
    setIsSubmitting(true);
    await rejectActivity(selectedActivity.activity_id, feedback);
    setIsSubmitting(false);
    setSelectedActivity(null);
    setFeedback('');
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Activity Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <TableRow key={activity.activity_id}>
                  {/* --- CORRECTED DATA ACCESS --- */}
                  <TableCell>{activity.students?.profiles?.full_name}</TableCell>
                  <TableCell className="font-medium">{activity.title}</TableCell>
                  <TableCell>{activity.activity_categories?.name}</TableCell>
                  <TableCell>{new Date(activity.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" onClick={() => setSelectedActivity(activity)}>Review</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">No pending activities.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedActivity?.title}</DialogTitle>
            <DialogDescription>
              {/* --- CORRECTED DATA ACCESS --- */}
              Submitted by {selectedActivity?.students?.profiles?.full_name} on {new Date(selectedActivity?.created_at || '').toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <p><strong>Category:</strong> {selectedActivity?.activity_categories?.name}</p>
            <p><strong>Credits to be Awarded:</strong> {selectedActivity?.credits_earned}</p>
            <p><strong>Description / Learnings:</strong></p>
            <p className="text-sm text-muted-foreground p-2 border rounded-md">{selectedActivity?.description || 'No description provided.'}</p>
            <Link href={selectedActivity?.activity_proofs[0]?.file_url || '#'} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">View Proof Document</Button>
            </Link>
            <div className="space-y-2 pt-4">
              <Label htmlFor="feedback">Feedback (Required for rejection)</Label>
              <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide a reason for rejection..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>Reject</Button>
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleApprove} disabled={isSubmitting}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}