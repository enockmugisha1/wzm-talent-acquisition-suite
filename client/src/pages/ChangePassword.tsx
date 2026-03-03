import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/images/logo-v2.png";

export default function ChangePassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    const userStr = sessionStorage.getItem("wzm_logged_in_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const admins = JSON.parse(localStorage.getItem("wzm_admins") || "[]");
      
      const updatedAdmins = admins.map((a: any) => {
        if (a.username === user.username) {
          return { ...a, password: newPassword, mustChangePassword: false };
        }
        return a;
      });

      localStorage.setItem("wzm_admins", JSON.stringify(updatedAdmins));
      sessionStorage.setItem("wzm_logged_in_user", JSON.stringify({ ...user, mustChangePassword: false }));
      
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setLocation("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-none">
        <CardHeader className="bg-white pt-10 pb-6 text-center">
          <img src={logoImage} alt="WZM Logo" className="h-16 w-auto mx-auto mb-6 object-contain" />
          <CardTitle className="text-2xl font-bold text-primary">Change Password</CardTitle>
          <CardDescription>You must change your password before continuing</CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-primary text-white">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
