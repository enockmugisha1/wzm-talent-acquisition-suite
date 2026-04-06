import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Globe, Lock, User, ArrowRight, Briefcase, Users, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logoImage from "@/assets/images/logo1.png";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language, setLanguage } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then((data) => { if (data.needsSetup) setLocation("/admin/setup"); });
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { username, password });
      const admin = await res.json();
      toast({ title: "Welcome back!", description: `Logged in as ${admin.username}.` });
      if (admin.mustChangePassword) {
        setLocation("/admin/change-password");
      } else {
        setLocation("/admin/dashboard");
      }
    } catch {
      toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — Branding ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute bottom-1/3 -left-10 h-32 w-32 rounded-full bg-white/8" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="WZM Logo" className="h-16 w-auto object-contain brightness-0 invert" />
            <div>
              <p className="text-white font-bold text-lg leading-tight">WZM HR Solution</p>
              <p className="text-white/60 text-xs">Human Resource Solution Co. Ltd</p>
            </div>
          </div>

          {/* Main text */}
          <div className="mt-auto mb-auto pt-20">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Admin Portal
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Manage your workforce, track applications, and grow your team — all in one place.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                { icon: Briefcase, label: "Jobs Posted", value: "Active" },
                { icon: Users,     label: "Applicants", value: "Tracked" },
                { icon: TrendingUp, label: "HR Insights", value: "Real-time" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                  <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-2">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-white font-bold text-sm">{value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-auto">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} WZM Human Resource Solution Co. Ltd
            </p>
            <p className="text-white/40 text-xs mt-1">wmhrsolution@gmail.com · +250796661213</p>
          </div>
        </div>
      </div>

      {/* ── Right panel — Login form ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <img src={logoImage} alt="WZM" className="h-12 w-auto object-contain" />
            <span className="font-bold text-primary text-sm">WZM HR</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "中文" : "EN"}
            </button>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← {t('admin.login.return')}
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <img src={logoImage} alt="WZM Logo" className="h-16 w-auto mx-auto object-contain mb-3" />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {t('admin.login.title')}
              </h2>
              <p className="text-muted-foreground">{t('admin.login.desc')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('admin.login.username')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t('admin.login.username_ph')}
                    className="h-12 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t('admin.login.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('admin.login.password_ph')}
                    className="h-12 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('admin.login.loading')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('admin.login.btn')} <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider hint */}
            <p className="text-center text-xs text-muted-foreground mt-8">
              Secure admin access · WZM HR Solution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
