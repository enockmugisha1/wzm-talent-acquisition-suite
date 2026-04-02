import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Loader2, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logoImage from "@/assets/images/logo-v2.png";

export default function AdminSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language, setLanguage } = useI18n();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // If setup already done, redirect to login
  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then((data) => {
        if (!data.needsSetup) setLocation("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Setup complete!", description: "Your super admin account has been created. Please log in." });
      setLocation("/admin/login");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <div className="w-full max-w-md">
        {/* Top row: badge + language toggle */}
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full border border-accent/20">
            <ShieldCheck className="h-4 w-4" /> {t('admin.setup.badge')}
          </span>
          <button
            onClick={() => setLanguage(language === "en" ? "zh" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-800 transition-colors border border-slate-200 bg-white/80"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "中文" : "EN"}
          </button>
        </div>

        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
          <CardHeader className="bg-white pt-8 pb-4 text-center">
            <img src={logoImage} alt="WZM Logo" className="h-14 w-auto mx-auto mb-4 object-contain" />
            <CardTitle className="text-2xl font-bold text-primary">{t('admin.setup.title')}</CardTitle>
            <CardDescription className="text-base mt-1">{t('admin.setup.desc')}</CardDescription>
          </CardHeader>

          <CardContent className="bg-white px-8 pb-10 pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">{t('admin.setup.username')}</Label>
                <Input
                  id="username"
                  placeholder={t('admin.setup.username_ph')}
                  className="h-11"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">{t('admin.setup.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">{t('admin.setup.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('admin.setup.password_ph')}
                  className="h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-sm font-semibold">{t('admin.setup.confirm')}</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder={t('admin.setup.confirm_ph')}
                  className="h-11"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <div className="bg-primary/5 rounded-xl p-4 text-sm text-muted-foreground border border-primary/10">
                <strong className="text-primary">{t('admin.setup.super_admin')}</strong> — {t('admin.setup.info')}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t('admin.setup.loading')}</>
                ) : (
                  t('admin.setup.btn')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
