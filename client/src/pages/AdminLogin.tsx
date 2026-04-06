import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Globe, Lock, User, ArrowRight, Briefcase, Users, TrendingUp,
  Mail, CheckCircle2, ArrowLeft, Eye, EyeOff,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logoImage from "@/assets/images/logo1.png";

type Mode = "login" | "forgot" | "sent";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language, setLanguage } = useI18n();

  const [mode, setMode] = useState<Mode>("login");

  // Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password
  const [email, setEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then((data) => { if (data.needsSetup) setLocation("/admin/setup"); });
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
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
      setLoginLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMode("sent");
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel — Branding (desktop only) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-primary flex-col relative overflow-hidden">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute bottom-1/3 -left-10 h-32 w-32 rounded-full bg-white/8" />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="WZM Logo" className="h-14 w-auto object-contain" />
            <div>
              <p className="text-white font-bold text-lg leading-tight">WZM HR Solution</p>
              <p className="text-white/60 text-xs">Human Resource Solution Co. Ltd</p>
            </div>
          </div>

          <div className="mt-auto mb-auto pt-16">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">Admin Portal</h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Manage your workforce, track applications, and grow your team — all in one place.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-3">
              {[
                { icon: Briefcase, label: "Jobs Posted", value: "Active" },
                { icon: Users, label: "Applicants", value: "Tracked" },
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

          <div className="mt-auto">
            <p className="text-white/40 text-xs">© {new Date().getFullYear()} WZM Human Resource Solution Co. Ltd</p>
            <p className="text-white/40 text-xs mt-1">wmhrsolution@gmail.com · +250796661213</p>
          </div>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/" className="flex items-center gap-2 lg:invisible">
            <img src={logoImage} alt="WZM" className="h-10 w-auto object-contain" />
            <span className="font-bold text-primary text-sm hidden sm:inline">WZM HR</span>
          </Link>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "中文" : "EN"}
            </button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              ← {t("admin.login.return")}
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
          <div className="w-full max-w-sm sm:max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-6">
              <img src={logoImage} alt="WZM Logo" className="h-14 w-auto mx-auto object-contain mb-2" />
              <p className="text-xs text-muted-foreground">Human Resource Solution Co. Ltd</p>
            </div>

            {/* ── LOGIN FORM ─────────────────────────────────────────── */}
            {mode === "login" && (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1.5">
                    {t("admin.login.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">{t("admin.login.desc")}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("admin.login.username")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="username"
                        type="text"
                        placeholder={t("admin.login.username_ph")}
                        className="h-12 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("admin.login.password")}
                      </Label>
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        {t("admin.login.forgot")}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="password"
                        type={showPass ? "text" : "password"}
                        placeholder={t("admin.login.password_ph")}
                        className="h-12 pl-10 pr-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("admin.login.loading")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {t("admin.login.btn")} <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground mt-8">
                  Secure admin access · WZM HR Solution
                </p>
              </>
            )}

            {/* ── FORGOT PASSWORD FORM ───────────────────────────────── */}
            {mode === "forgot" && (
              <>
                <button
                  onClick={() => setMode("login")}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("admin.forgot.back")}
                </button>

                <div className="mb-7">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1.5">
                    {t("admin.forgot.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">{t("admin.forgot.desc")}</p>
                </div>

                <form onSubmit={handleForgot} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("admin.forgot.email")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("admin.forgot.email_ph")}
                        className="h-12 pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("admin.forgot.loading")}
                      </span>
                    ) : (
                      t("admin.forgot.btn")
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* ── EMAIL SENT CONFIRMATION ────────────────────────────── */}
            {mode === "sent" && (
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {t("admin.forgot.sent_title")}
                </h2>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  {t("admin.forgot.sent_desc")}
                </p>
                <Button
                  onClick={() => { setMode("login"); setEmail(""); }}
                  variant="outline"
                  className="w-full h-12"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("admin.forgot.back")}
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
