import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/images/logo-v2.png";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock full-stack behavior in frontend
    setTimeout(() => {
      const storedAdmins = JSON.parse(localStorage.getItem("wzm_admins") || "[]");
      
      // Initialize default super admin if none exist
      if (storedAdmins.length === 0) {
        const defaultAdmin = {
          username: "MOU HAIYAN",
          password: "HAIYAN@123", // In a real app, this would be hashed
          role: "super_admin",
          mustChangePassword: true
        };
        storedAdmins.push(defaultAdmin);
        localStorage.setItem("wzm_admins", JSON.stringify(storedAdmins));
      }

      const admin = storedAdmins.find((a: any) => a.username === username && a.password === password);

      if (admin) {
        sessionStorage.setItem("wzm_logged_in_user", JSON.stringify(admin));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${admin.username}!`,
        });
        
        if (admin.mustChangePassword) {
          setLocation("/admin/change-password");
        } else {
          setLocation("/admin/dashboard");
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-none">
        <CardHeader className="bg-white pt-10 pb-6 text-center">
          <Link href="/">
            <img src={logoImage} alt="WZM Logo" className="h-16 w-auto mx-auto mb-6 object-contain cursor-pointer" />
          </Link>
          <CardTitle className="text-2xl font-bold text-primary">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-8 md:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="h-12"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Return to Website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
