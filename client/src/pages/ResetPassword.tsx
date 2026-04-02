import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logoImage from "@/assets/images/logo-v2.png";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();

  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Validate the token from the URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || "";
    setToken(t);

    if (!t) {
      setTokenValid(false);
      setChecking(false);
      return;
    }

    fetch(`/api/auth/reset-password/${t}`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUsername(data.username);
        setTokenValid(true);
      })
      .catch(() => setTokenValid(false))
      .finally(() => setChecking(false));
  }, []);

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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setIsDone(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
          <CardHeader className="bg-white pt-8 pb-4 text-center">
            <img src={logoImage} alt="WZM Logo" className="h-14 w-auto mx-auto mb-4 object-contain" />
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">{t('admin.reset.title')}</CardTitle>
            {tokenValid && (
              <CardDescription className="text-base mt-1">
                {t('admin.reset.desc').replace('{name}', username)}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="bg-white px-8 pb-10 pt-4">

            {/* Invalid / expired token */}
            {!tokenValid && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <AlertCircle className="h-14 w-14 text-destructive" />
                </div>
                <p className="font-semibold text-lg">{t('admin.reset.invalid_title')}</p>
                <p className="text-muted-foreground text-sm">{t('admin.reset.invalid_desc')}</p>
              </div>
            )}

            {/* Success state */}
            {tokenValid && isDone && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-14 w-14 text-green-500" />
                </div>
                <p className="font-semibold text-lg">{t('admin.reset.success_title')}</p>
                <p className="text-muted-foreground text-sm">{t('admin.reset.success_desc')}</p>
                <Button
                  className="w-full bg-primary text-white h-11"
                  onClick={() => setLocation("/admin/login")}
                >
                  {t('admin.reset.goto_login')}
                </Button>
              </div>
            )}

            {/* Set password form */}
            {tokenValid && !isDone && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label>{t('admin.reset.new_password')}</Label>
                  <Input
                    type="password"
                    placeholder={t('admin.placeholder.min6')}
                    className="h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('admin.reset.confirm')}</Label>
                  <Input
                    type="password"
                    placeholder={t('admin.placeholder.min6')}
                    className="h-11"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t('admin.reset.loading')}</>
                    : t('admin.reset.btn')}
                </Button>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
