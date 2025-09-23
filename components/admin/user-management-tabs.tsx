// components/admin/user-management-tabs.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateUserModal } from './create-user-modal';
import { EditUserModal } from './edit-user-modal';
import { BulkUploadModal } from './bulk-upload-modal';

type Student = { 
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
type Faculty = { 
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

export function UserManagementTabs({ students, faculty }: { students: Student[], faculty: Faculty[] }) {
  const getInitials = (name: string | null) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <Tabs defaultValue="students">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="faculty">Faculty</TabsTrigger>
      </TabsList>
      <TabsContent value="students">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Students</CardTitle><CardDescription>A list of all student accounts.</CardDescription></div>
            <div className="flex gap-2">
              <BulkUploadModal role="student" />
              <CreateUserModal role="student" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.profiles?.profile_photo_url || ''} alt={student.profiles?.full_name || 'Student'} />
                        <AvatarFallback>{getInitials(student.profiles?.full_name || null)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{student.profiles?.full_name}</TableCell>
                    <TableCell>{student.profiles?.email}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      <EditUserModal user={student} role="student" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="faculty">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Faculty</CardTitle><CardDescription>A list of all faculty accounts.</CardDescription></div>
            <div className="flex gap-2">
              <BulkUploadModal role="faculty" />
              <CreateUserModal role="faculty" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((prof) => (
                  <TableRow key={prof.id}>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={prof.profiles?.profile_photo_url || ''} alt={prof.profiles?.full_name || 'Faculty'} />
                        <AvatarFallback>{getInitials(prof.profiles?.full_name || null)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{prof.profiles?.full_name}</TableCell>
                    <TableCell>{prof.profiles?.email}</TableCell>
                    <TableCell>{prof.department}</TableCell>
                    <TableCell>{prof.designation}</TableCell>
                    <TableCell>
                      <EditUserModal user={prof} role="faculty" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}