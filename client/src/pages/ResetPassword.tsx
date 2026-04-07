import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import logoImage from "@/assets/images/logo-light.png";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [source, setSource] = useState<"reset" | "setup">("setup"); // "reset" = forgot-password flow
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tok = params.get("token") || "";
    const src = params.get("source") === "reset" ? "reset" : "setup";
    setToken(tok);
    setSource(src);

    if (!tok) {
      setTokenValid(false);
      setChecking(false);
      return;
    }

    fetch(`/api/auth/reset-password/${tok}`)
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

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isReset = source === "reset";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
          <CardHeader className="bg-white pt-8 pb-4 text-center">
            <img src={logoImage} alt="WZM Logo" className="h-14 w-auto mx-auto mb-4 object-contain" />
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {isReset ? "Reset Password" : "Set Your Password"}
            </CardTitle>
            {tokenValid && !isDone && (
              <CardDescription className="text-base mt-1">
                {isReset
                  ? `Hi ${username}, choose a new password for your account.`
                  : `Welcome, ${username}. Choose a strong password to activate your account.`}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="bg-white px-6 sm:px-8 pb-10 pt-4">

            {/* Invalid / expired token */}
            {!tokenValid && (
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                  <AlertCircle className="h-14 w-14 text-destructive" />
                </div>
                <p className="font-semibold text-lg">This link is invalid or has expired</p>
                <p className="text-muted-foreground text-sm">
                  {isReset
                    ? "Password reset links expire after 1 hour. Please request a new one from the login page."
                    : "Password setup links expire after 24 hours. Please ask your super admin to resend the invitation."}
                </p>
                {isReset && (
                  <Button
                    className="w-full bg-primary text-white h-11"
                    onClick={() => setLocation("/admin/login")}
                  >
                    Back to Login
                  </Button>
                )}
              </div>
            )}

            {/* Success state */}
            {tokenValid && isDone && (
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-14 w-14 text-green-500" />
                </div>
                <p className="font-semibold text-lg">
                  {isReset ? "Password reset successfully!" : "Password set successfully!"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {isReset
                    ? "Your password has been updated. You can now log in with your new password."
                    : "Your account is now active. You can log in with your username and new password."}
                </p>
                <Button
                  className="w-full bg-primary text-white h-11"
                  onClick={() => setLocation("/admin/login")}
                >
                  Go to Login
                </Button>
              </div>
            )}

            {/* Set / reset password form */}
            {tokenValid && !isDone && (
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      className="h-11 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat password"
                      className="h-11 pr-10"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength hint */}
                {password.length > 0 && (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((level) => {
                      const strength =
                        (password.length >= 8 ? 1 : 0) +
                        (/[A-Z]/.test(password) ? 1 : 0) +
                        (/[0-9]/.test(password) ? 1 : 0) +
                        (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= strength
                              ? strength <= 1 ? "bg-red-400" : strength <= 2 ? "bg-yellow-400" : "bg-green-500"
                              : "bg-slate-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Setting password...</>
                  ) : (
                    isReset ? "Reset Password" : "Activate My Account"
                  )}
                </Button>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
