import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import logoImage from "@/assets/images/logo1.png";

export default function ChangePassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { t } = useI18n();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({ title: "Invalid Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/change-password", { newPassword });
      // Invalidate the cached /api/auth/me so dashboard re-fetches updated mustChangePassword
      qc.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Success", description: "Password updated successfully." });
      setLocation("/admin/dashboard");
    } catch {
      toast({ title: "Error", description: "Failed to update password. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-none">
        <CardHeader className="bg-white pt-10 pb-6 text-center">
          <img src={logoImage} alt="WZM Logo" className="h-16 w-auto mx-auto mb-6 object-contain" />
          <CardTitle className="text-2xl font-bold text-primary">{t('admin.change.title')}</CardTitle>
          <CardDescription>{t('admin.change.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="bg-white p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('admin.change.new')}</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder={t('admin.placeholder.min6')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('admin.change.confirm')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('admin.placeholder.min6')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-primary text-white" disabled={isLoading}>
              {isLoading ? t('admin.change.loading') : t('admin.change.btn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
