import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Briefcase, FileUser, Plus, Trash2, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", role: "admin" });

  useEffect(() => {
    const userStr = sessionStorage.getItem("wzm_logged_in_user");
    if (!userStr) {
      setLocation("/admin/login");
      return;
    }
    const loggedInUser = JSON.parse(userStr);
    if (loggedInUser.mustChangePassword) {
      setLocation("/admin/change-password");
      return;
    }
    setUser(loggedInUser);
    setAdmins(JSON.parse(localStorage.getItem("wzm_admins") || "[]"));
  }, []);

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    const updatedAdmins = [...admins, { ...newAdmin, mustChangePassword: true }];
    localStorage.setItem("wzm_admins", JSON.stringify(updatedAdmins));
    setAdmins(updatedAdmins);
    setNewAdmin({ username: "", password: "", role: "admin" });
    toast({ title: "Success", description: "Admin created successfully" });
  };

  const handleDeleteAdmin = (username: string) => {
    if (username === user.username) {
      toast({ title: "Error", description: "You cannot delete yourself", variant: "destructive" });
      return;
    }
    const updatedAdmins = admins.filter(a => a.username !== username);
    localStorage.setItem("wzm_admins", JSON.stringify(updatedAdmins));
    setAdmins(updatedAdmins);
    toast({ title: "Deleted", description: "Admin account removed" });
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.username} ({user.role})</p>
          </div>
          <Button variant="outline" onClick={() => {
            sessionStorage.removeItem("wzm_logged_in_user");
            setLocation("/admin/login");
          }}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">12</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">48</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Applications</CardTitle>
              <FileUser className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">5</div></CardContent>
          </Card>
        </div>

        {user.role === "super_admin" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-accent" /> Admin Management
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle>Manage Administrators</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin.username}>
                          <TableCell className="font-medium">{admin.username}</TableCell>
                          <TableCell className="capitalize">{admin.role.replace("_", " ")}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAdmin(admin.username)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Create New Admin</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Temp Password</Label>
                      <Input type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={newAdmin.role} onValueChange={val => setNewAdmin({...newAdmin, role: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-primary text-white">
                      <Plus className="mr-2 h-4 w-4" /> Create Admin
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
