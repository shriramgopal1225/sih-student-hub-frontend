// components/admin/edit-user-modal.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUser } from '@/app/(platform)/admin/user-management/actions';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EditIcon } from 'lucide-react';

type StudentProfile = {
  id: string;
  course: string;
  year: number;
  enrollment_no: string;
  gpa: number | null;
  cgpa: number | null;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    profile_photo_url: string | null;
  } | null;
};

type FacultyProfile = {
  id: string;
  department: string;
  designation: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    profile_photo_url: string | null;
  } | null;
};

type EditUserModalProps = {
  user: StudentProfile | FacultyProfile;
  role: 'student' | 'faculty';
};

export function EditUserModal({ user, role }: EditUserModalProps) {
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
    // Add the user ID to the form data
    formData.set('userId', user.id);
    formData.set('role', role);
    
    const result = await updateUser(formData);
    if (result?.error) {
      alert(`Error: ${result.error}`);
    } else {
      alert(result.success);
      setIsOpen(false);
    }
  };

  const getInitials = (name: string | null) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form action={handleFormAction}>
          <DialogHeader>
            <DialogTitle>Edit {role === 'student' ? 'Student' : 'Faculty'} Profile</DialogTitle>
            <DialogDescription>Update the profile information and photo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            {/* Current Profile Photo */}
            <div className="space-y-2">
              <Label>Current Profile Photo</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profiles?.profile_photo_url || ''} alt={user.profiles?.full_name || 'User'} />
                  <AvatarFallback>{getInitials(user.profiles?.full_name || null)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            {/* Basic Profile Information */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="fullName" defaultValue={user.profiles?.full_name || ''} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" defaultValue={user.profiles?.email || ''} required />
            </div>
            
            <div className="space-y-2">
              <Label>Profile Photo (Optional)</Label>
              <Input name="profilePhoto" type="file" accept="image/*" />
              <p className="text-sm text-gray-500">Upload a new photo to replace the current one</p>
            </div>
            
            {/* Role-specific fields */}
            {role === 'student' && (
              <>
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select name="course" defaultValue={(user as StudentProfile).course} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select name="year" defaultValue={(user as StudentProfile).year.toString()} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>GPA (Optional)</Label>
                  <Input 
                    name="gpa" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    defaultValue={(user as StudentProfile).gpa?.toString() || ''} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>CGPA (Optional)</Label>
                  <Input 
                    name="cgpa" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    defaultValue={(user as StudentProfile).cgpa?.toString() || ''} 
                  />
                </div>
              </>
            )}
            
            {role === 'faculty' && (
              <>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select name="department" defaultValue={(user as FacultyProfile).department} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input name="designation" defaultValue={(user as FacultyProfile).designation} required />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Update Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}