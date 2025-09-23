// app/(platform)/hod/department/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Award, Plus, Settings } from 'lucide-react';

export default async function HODDepartmentPage() {
  const supabase = createClient();

  // Mock data for demonstration
  const departmentData = {
    name: "Computer Science & Engineering",
    faculty: [
      { id: 1, name: "Dr. Rajesh Kumar", designation: "Professor", qualification: "PhD", experience: 15, publications: 45 },
      { id: 2, name: "Dr. Priya Sharma", designation: "Associate Professor", qualification: "PhD", experience: 12, publications: 32 },
      { id: 3, name: "Mr. Amit Singh", designation: "Assistant Professor", qualification: "Masters", experience: 8, publications: 18 },
      { id: 4, name: "Dr. Neha Gupta", designation: "Professor", qualification: "PhD", experience: 18, publications: 56 }
    ],
    students: [
      { id: 1, name: "Arjun Patel", enrollment: "CSE2021001", year: 3, cgpa: 8.5, activities: 12 },
      { id: 2, name: "Kavya Reddy", enrollment: "CSE2021002", year: 3, cgpa: 9.2, activities: 15 },
      { id: 3, name: "Rohit Mehta", enrollment: "CSE2022001", year: 2, cgpa: 7.8, activities: 8 },
      { id: 4, name: "Ananya Krishnan", enrollment: "CSE2022002", year: 2, cgpa: 8.9, activities: 11 }
    ]
  };

  const facultyStats = {
    total: departmentData.faculty.length,
    phd: departmentData.faculty.filter(f => f.qualification === "PhD").length,
    avgExperience: Math.round(departmentData.faculty.reduce((sum, f) => sum + f.experience, 0) / departmentData.faculty.length),
    totalPublications: departmentData.faculty.reduce((sum, f) => sum + f.publications, 0)
  };

  const studentStats = {
    total: departmentData.students.length,
    avgCgpa: (departmentData.students.reduce((sum, s) => sum + s.cgpa, 0) / departmentData.students.length).toFixed(2),
    totalActivities: departmentData.students.reduce((sum, s) => sum + s.activities, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Department Management</h1>
          <p className="text-muted-foreground">{departmentData.name}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Department Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultyStats.total}</div>
            <p className="text-xs text-muted-foreground">{facultyStats.phd} with PhD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentStats.total}</div>
            <p className="text-xs text-muted-foreground">Avg CGPA: {studentStats.avgCgpa}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Output</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultyStats.totalPublications}</div>
            <p className="text-xs text-muted-foreground">Total publications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultyStats.avgExperience}</div>
            <p className="text-xs text-muted-foreground">Years per faculty</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="faculty" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
          <TabsTrigger value="students">Student Overview</TabsTrigger>
          <TabsTrigger value="research">Research & Publications</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.faculty.map((faculty) => (
                  <div key={faculty.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{faculty.name}</div>
                      <div className="text-sm text-muted-foreground">{faculty.designation}</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{faculty.qualification}</div>
                        <div className="text-muted-foreground">Qualification</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{faculty.experience}y</div>
                        <div className="text-muted-foreground">Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{faculty.publications}</div>
                        <div className="text-muted-foreground">Publications</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={faculty.qualification === 'PhD' ? 'default' : 'secondary'}>
                        {faculty.qualification}
                      </Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.enrollment}</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">Year {student.year}</div>
                        <div className="text-muted-foreground">Current</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{student.cgpa}</div>
                        <div className="text-muted-foreground">CGPA</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{student.activities}</div>
                        <div className="text-muted-foreground">Activities</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={student.cgpa >= 8.5 ? 'default' : student.cgpa >= 7.5 ? 'secondary' : 'outline'}>
                        {student.cgpa >= 8.5 ? 'Excellent' : student.cgpa >= 7.5 ? 'Good' : 'Average'}
                      </Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Research Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Publications</span>
                  <span className="font-medium">{facultyStats.totalPublications}</span>
                </div>
                <div className="flex justify-between">
                  <span>Publications per Faculty</span>
                  <span className="font-medium">{Math.round(facultyStats.totalPublications / facultyStats.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PhD Faculty Ratio</span>
                  <span className="font-medium">{Math.round((facultyStats.phd / facultyStats.total) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Experience</span>
                  <span className="font-medium">{facultyStats.avgExperience} years</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Annual Publication Target</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Faculty PhD Ratio Target</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}