// components/admin/user-management-tabs.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateUserModal } from './create-user-modal';

type Student = { id: string; course: string; year: number; profiles: { full_name: string; email: string; } | null; };
type Faculty = { id: string; department: string; designation: string; profiles: { full_name: string; email: string; } | null; };

export function UserManagementTabs({ students, faculty }: { students: Student[], faculty: Faculty[] }) {
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
            <CreateUserModal role="student" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Course</TableHead><TableHead>Year</TableHead></TableRow></TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.profiles?.full_name}</TableCell>
                    <TableCell>{student.profiles?.email}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.year}</TableCell>
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
            <CreateUserModal role="faculty" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead><TableHead>Designation</TableHead></TableRow></TableHeader>
              <TableBody>
                {faculty.map((prof) => (
                  <TableRow key={prof.id}>
                    <TableCell className="font-medium">{prof.profiles?.full_name}</TableCell>
                    <TableCell>{prof.profiles?.email}</TableCell>
                    <TableCell>{prof.department}</TableCell>
                    <TableCell>{prof.designation}</TableCell>
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