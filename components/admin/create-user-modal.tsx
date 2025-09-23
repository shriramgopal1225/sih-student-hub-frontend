// components/admin/create-user-modal.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createNewUser } from '@/app/(platform)/admin/user-management/actions';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function CreateUserModal({ role }: { role: 'student' | 'faculty' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const fetchDepartments = async () => {
      const { data, error } = await supabase.rpc('get_department_enum_values');
      if (data) setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const handleFormAction = async (formData: FormData) => {
    const result = await createNewUser(formData);
    if (result?.error) {
      alert(`Error: ${result.error}`);
    } else {
      alert(result.success);
      setIsOpen(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>+ Create New {role === 'student' ? 'Student' : 'Faculty'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {/* --- THIS IS THE FIX: Removed the encType attribute --- */}
        <form action={handleFormAction}>
          <DialogHeader>
            <DialogTitle>Create New {role === 'student' ? 'Student' : 'Faculty'}</DialogTitle>
            <DialogDescription>Fill in the details for the new user account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <Input type="hidden" name="role" value={role} />
            <div className="space-y-2"><Label>Full Name</Label><Input name="fullName" required /></div>
            <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
            <div className="space-y-2"><Label>Temporary Password</Label><Input name="password" type="password" required /></div>
            
            <div className="space-y-2">
              <Label>Profile Photo (Optional)</Label>
              <Input name="profilePhoto" type="file" accept="image/*" />
            </div>
            
            {role === 'student' && (
              <>
                <div className="space-y-2"><Label>Enrollment Number</Label><Input name="enrollmentNo" required /></div>
                <div className="space-y-2"><Label>Course</Label><Select name="course" required><SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Year</Label><Input name="year" type="number" defaultValue="1" required /></div>
                <div className="space-y-2"><Label>GPA (Optional)</Label><Input name="gpa" type="number" step="0.01" /></div>
                <div className="space-y-2"><Label>CGPA (Optional)</Label><Input name="cgpa" type="number" step="0.01" /></div>
              </>
            )}
            {role === 'faculty' && (
              <>
                <div className="space-y-2"><Label>Department</Label><Select name="department" required><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Designation</Label><Input name="designation" defaultValue="Professor" required /></div>
              </>
            )}
          </div>
          <DialogFooter><Button type="submit">Create User</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}