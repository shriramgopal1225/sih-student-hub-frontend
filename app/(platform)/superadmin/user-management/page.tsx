// app/(platform)/superadmin/user-management/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Shield, Settings } from 'lucide-react';
import { CreateUserModal } from '@/components/admin/create-user-modal';
import { UserManagementTable } from '@/components/superadmin/user-management-table';

export default async function SuperadminUserManagement() {
  const supabase = createClient();

  // Fetch comprehensive user statistics
  const [
    { count: totalStudents },
    { count: totalFaculty },
    { count: totalAdmins },
    { count: totalSuperadmins },
    { count: totalHODs },
    { data: recentUsers }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('faculty').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'superadmin'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'hod'),
    supabase.from('profiles')
      .select('full_name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  const totalUsers = (totalStudents || 0) + (totalFaculty || 0) + (totalAdmins || 0) + (totalSuperadmins || 0) + (totalHODs || 0);

  // Fetch all users for the management table
  const { data: allUsers } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      role,
      created_at,
      students(enrollment_no, course, year),
      faculty(department, designation)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all system users and roles</p>
        </div>
        <div className="flex gap-3">
          <CreateUserModal role="student" />
          <CreateUserModal role="faculty" />
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Role Management
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">All system users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Badge variant="secondary">{totalStudents || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty</CardTitle>
            <Badge variant="secondary">{totalFaculty || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFaculty || 0}</div>
            <p className="text-xs text-muted-foreground">Teaching staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Badge variant="secondary">{totalAdmins || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins || 0}</div>
            <p className="text-xs text-muted-foreground">System admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HODs</CardTitle>
            <Badge variant="secondary">{totalHODs || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHODs || 0}</div>
            <p className="text-xs text-muted-foreground">Department heads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Superadmins</CardTitle>
            <Badge variant="default">{totalSuperadmins || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuperadmins || 0}</div>
            <p className="text-xs text-muted-foreground">Super administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs */}
      <Tabs defaultValue="all-users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="role-management">Role Management</TabsTrigger>
          <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="all-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Directory</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagementTable users={(allUsers || []).map(user => ({
                ...user,
                students: Array.isArray(user.students) && user.students.length > 0 ? user.students[0] : null,
                faculty: Array.isArray(user.faculty) && user.faculty.length > 0 ? user.faculty[0] : null
              }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="role-management" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Hierarchy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Superadmin</div>
                      <div className="text-sm text-muted-foreground">Full system access and NAAC/NIRF reports</div>
                    </div>
                    <Badge>Highest</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-sm text-muted-foreground">User management and system administration</div>
                    </div>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">HOD</div>
                      <div className="text-sm text-muted-foreground">Department management and reports</div>
                    </div>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Faculty</div>
                      <div className="text-sm text-muted-foreground">Activity verification and student guidance</div>
                    </div>
                    <Badge variant="outline">Standard</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Student</div>
                      <div className="text-sm text-muted-foreground">Activity submission and portfolio management</div>
                    </div>
                    <Badge variant="outline">Basic</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-medium">System Permissions:</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>NAAC/NIRF Reports</span>
                      <Badge>Superadmin</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>User Management</span>
                      <Badge variant="secondary">Admin+</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Department Reports</span>
                      <Badge variant="secondary">HOD+</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Activity Verification</span>
                      <Badge variant="outline">Faculty+</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Activity Submission</span>
                      <Badge variant="outline">Student+</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent-activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers?.slice(0, 10).map((user, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        user.role === 'superadmin' ? 'default' :
                        user.role === 'admin' ? 'secondary' :
                        user.role === 'hod' ? 'secondary' :
                        'outline'
                      }>
                        {user.role}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <UserPlus className="h-6 w-6" />
                  <span>Bulk User Import</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Role Assignment</span>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Use bulk operations to efficiently manage large numbers of users.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}