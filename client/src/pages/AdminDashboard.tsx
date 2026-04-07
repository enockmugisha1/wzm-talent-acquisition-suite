import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/lib/theme";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Briefcase, FileUser, Plus, Trash2, ShieldCheck,
  Download, Pencil, LogOut, Loader2, X, CheckCircle, Clock,
  LayoutDashboard, ChevronRight, Mail, Phone, CalendarDays,
  TrendingUp, UserPlus, AlertCircle, Globe, MessageSquare, Eye,
  Reply, Settings, Sun, Moon, Star, Quote,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoImage from "@/assets/images/logo-light.png";
import { useI18n } from "@/lib/i18n";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AdminUser { id: string; username: string; role: string; mustChangePassword: boolean }
interface Job { id: number; title: string; location: string; type: string; description: string; deadline: string; status: string; posted: string }
interface Application { id: number; fullName: string; email: string; phone: string; position: string; cvFilename: string; status: string; submittedAt: string; jobId?: { title: string } }
interface ContactMessage { id: number; name: string; email: string; subject: string; message: string; read: boolean; submittedAt: string }
interface Testimonial { id: number; name: string; role: string; company: string; quote: string; rating: number; active: boolean; order: number }

const TABS = ["Overview", "Jobs", "Applications", "Messages", "Testimonials", "Admins"] as const;
type Tab = typeof TABS[number];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const STATUS_CLS: Record<string, string> = {
  new:         "bg-blue-50 text-blue-700 border border-blue-200",
  reviewed:    "bg-amber-50 text-amber-700 border border-amber-200",
  shortlisted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected:    "bg-red-50 text-red-600 border border-red-200",
};

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  Overview:      <LayoutDashboard className="h-4 w-4" />,
  Jobs:          <Briefcase className="h-4 w-4" />,
  Applications:  <FileUser className="h-4 w-4" />,
  Messages:      <MessageSquare className="h-4 w-4" />,
  Testimonials:  <Star className="h-4 w-4" />,
  Admins:        <ShieldCheck className="h-4 w-4" />,
};

const EMPTY_JOB = { title: "", location: "", type: "Full-time", description: "", deadline: "", status: "open" };
const APP_GROUPS_PER_PAGE = 5;
const MSGS_PER_PAGE = 10;

// ── Mini pagination helper ─────────────────────────────────────────────────────
function buildPageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const list: (number | "…")[] = [1];
  if (page > 3) list.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) list.push(i);
  if (page < total - 2) list.push("…");
  list.push(total);
  return list;
}

function Pager({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = buildPageList(page, total);
  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button
        onClick={() => onChange(1)} disabled={page === 1}
        className="h-8 px-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >⏮</button>
      <button
        onClick={() => onChange(page - 1)} disabled={page === 1}
        className="h-8 px-2.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >‹ Prev</button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="h-8 px-2 flex items-center text-xs text-slate-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-semibold transition-colors ${
              page === p ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >{p}</button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)} disabled={page === total}
        className="h-8 px-2.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >Next ›</button>
      <button
        onClick={() => onChange(total)} disabled={page === total}
        className="h-8 px-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >⏭</button>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { t, language, setLanguage } = useI18n();

  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [jobForm, setJobForm] = useState(EMPTY_JOB);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", role: "admin" });
  // On mobile (<lg) sidebar starts closed; on desktop it starts open
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [liveUnread, setLiveUnread] = useState(0);
  const [replyDialog, setReplyDialog] = useState<{ open: boolean; contact: ContactMessage | null }>({ open: false, contact: null });
  const [replyMessage, setReplyMessage] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appStatusFilter, setAppStatusFilter] = useState<"all"|"new"|"reviewed"|"shortlisted"|"rejected">("all");
  const [appGroupPage, setAppGroupPage] = useState(1);
  const [msgPage, setMsgPage] = useState(1);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const toggleGroup = (key: string) => setCollapsedGroups(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
  const EMPTY_TESTIMONIAL = { name: "", role: "", company: "", quote: "", rating: 5, order: 0 };
  const [testimonialForm, setTestimonialForm] = useState(EMPTY_TESTIMONIAL);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: me, isError: meError } = useQuery<AdminUser>({ queryKey: ["/api/auth/me"] });
  const { data: jobs = [] } = useQuery<Job[]>({ queryKey: ["/api/jobs"], enabled: !!me });
  const { data: applications = [] } = useQuery<Application[]>({ queryKey: ["/api/applications"], enabled: !!me });
  const { data: admins = [] } = useQuery<AdminUser[]>({ queryKey: ["/api/admins"], enabled: me?.role === "super_admin" });
  const { data: contacts = [], refetch: refetchContacts } = useQuery<ContactMessage[]>({ queryKey: ["/api/contacts"], enabled: !!me, staleTime: 0, refetchOnWindowFocus: true });
  const { data: unreadData } = useQuery<{ count: number }>({ queryKey: ["/api/contacts/unread-count"], enabled: !!me, staleTime: 0, refetchOnWindowFocus: true });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials/all"], enabled: !!me });

  useEffect(() => { if (meError) setLocation("/admin/login"); }, [meError, setLocation]);
  useEffect(() => { if (me?.mustChangePassword) setLocation("/admin/change-password"); }, [me, setLocation]);
  // Reset pagination pages when filters change
  useEffect(() => { setAppGroupPage(1); }, [appStatusFilter]);

  // Keep liveUnread in sync with server — used as fallback before contacts load
  useEffect(() => { if (unreadData) setLiveUnread(unreadData.count); }, [unreadData]);

  // ── Polling — check for new messages every 10 seconds ────────────────────
  useEffect(() => {
    if (!me) return;
    const id = setInterval(() => {
      qc.invalidateQueries({ queryKey: ["/api/contacts/unread-count"] });
      qc.invalidateQueries({ queryKey: ["/api/contacts"] });
    }, 10000);
    return () => clearInterval(id);
  }, [me, qc]);

  // ── Mutations ─────────────────────────────────────────────────────────────────
  const saveJobMutation = useMutation({
    mutationFn: (data: typeof jobForm) =>
      editingJob
        ? apiRequest("PUT", `/api/jobs/${editingJob.id}`, data)
        : apiRequest("POST", "/api/jobs", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/jobs"] });
      setJobDialogOpen(false);
      setEditingJob(null);
      setJobForm(EMPTY_JOB);
      toast({ title: editingJob ? "Job updated" : "Job posted", description: "Changes saved successfully." });
    },
    onError: async (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/jobs/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/jobs"] }); toast({ title: "Job deleted" }); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/applications/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/applications"] }),
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/applications/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "Application deleted" });
    },
    onError: async (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const createAdminMutation = useMutation({
    mutationFn: (data: typeof newAdmin) => apiRequest("POST", "/api/admins", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admins"] });
      setNewAdmin({ username: "", email: "", role: "admin" });
      toast({ title: "Admin created", description: "A password setup link has been sent to their email." });
    },
    onError: async (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admins/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admins"] }); toast({ title: "Admin removed" }); },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/contacts/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/contacts"] });
      qc.invalidateQueries({ queryKey: ["/api/contacts/unread-count"] });
      setLiveUnread((n) => Math.max(0, n - 1));
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      apiRequest("POST", `/api/contacts/${id}/reply`, { message }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/contacts"] });
      qc.invalidateQueries({ queryKey: ["/api/contacts/unread-count"] });
      setLiveUnread((n) => Math.max(0, n - 1));
      setReplyDialog({ open: false, contact: null });
      setReplyMessage("");
      toast({ title: "Reply sent", description: "Your reply was emailed to the contact." });
    },
    onError: async (err: any) => toast({ title: "Failed to send reply", description: err.message, variant: "destructive" }),
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/contacts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/contacts"] });
      qc.invalidateQueries({ queryKey: ["/api/contacts/unread-count"] });
      toast({ title: "Message deleted" });
    },
    onError: async (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const saveTestimonialMutation = useMutation({
    mutationFn: (data: typeof testimonialForm) =>
      editingTestimonial
        ? apiRequest("PUT", `/api/testimonials/${editingTestimonial.id}`, data)
        : apiRequest("POST", "/api/testimonials", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      setTestimonialDialogOpen(false);
      setEditingTestimonial(null);
      setTestimonialForm(EMPTY_TESTIMONIAL);
      toast({ title: editingTestimonial ? "Testimonial updated" : "Testimonial added", description: "Changes saved successfully." });
    },
    onError: async (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const toggleTestimonialMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      apiRequest("PUT", `/api/testimonials/${id}`, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/testimonials/all"] }),
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/testimonials/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/testimonials/all"] }); toast({ title: "Testimonial deleted" }); },
  });

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const openCreateJob = () => { setEditingJob(null); setJobForm(EMPTY_JOB); setJobDialogOpen(true); };
  const openEditJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({ title: job.title, location: job.location, type: job.type, description: job.description, deadline: job.deadline, status: job.status });
    setJobDialogOpen(true);
  };
  const handleJobSubmit = (e: React.FormEvent) => { e.preventDefault(); saveJobMutation.mutate(jobForm); };
  const handleLogout = async () => { await apiRequest("POST", "/api/auth/logout"); setLocation("/admin/login"); };
  const downloadCV = (appId: number) => { window.open(`/api/applications/${appId}/cv`, "_blank"); };

  const newCount      = applications.filter((a) => a.status === "new").length;
  const openJobCount  = jobs.filter((j) => j.status === "open" && new Date(j.deadline + "T23:59:59") >= new Date()).length;

  // Show first name: strip email domain, take first dot-segment, capitalise
  const displayName = (() => {
    const local = me?.username?.includes("@") ? me.username.split("@")[0] : me?.username ?? "";
    const first = local.split(".")[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  })();
  const visibleTabs   = TABS.filter((t) => t !== "Admins" || me?.role === "super_admin");
  // Derive directly from loaded contacts (immediately reflects mark-as-read/delete)
  // Fall back to liveUnread (from polling) before contacts data arrives
  const unreadMsgCount = contacts.length > 0
    ? contacts.filter((c) => !c.read).length
    : liveUnread;

  if (!me) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t('admin.loading')}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">

      {/* ── Mobile backdrop ──────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col
        bg-[#0B2254] shadow-2xl
        transition-all duration-300 ease-in-out shrink-0
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
        lg:relative lg:z-auto lg:translate-x-0
        ${sidebarOpen ? "lg:w-64" : "lg:w-[72px]"}
      `}>

        {/* ── Logo / Brand ─────────────────────────────────────────────────── */}
        <div className="h-16 flex items-center px-4 gap-3 overflow-hidden border-b border-white/10">
          <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <img src={logoImage} alt="WZM" className="h-7 w-7 object-contain" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight truncate">{t('admin.portal.name')}</p>
              <p className="text-[11px] text-white/50 truncate">{t('admin.portal.subtitle')}</p>
            </div>
          )}
        </div>

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {sidebarOpen && (
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 pb-2">Main Menu</p>
          )}
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                title={!sidebarOpen ? tab : undefined}
                className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 group relative
                  ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}
                  ${isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                  }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-r-full" />
                )}
                <span className={`shrink-0 ${isActive ? "text-blue-300" : "text-white/50 group-hover:text-white/80"}`}>
                  {TAB_ICONS[tab]}
                </span>
                {sidebarOpen && (
                  <span className="flex-1 text-left">{t(`admin.tab.${tab.toLowerCase()}`)}</span>
                )}
                {sidebarOpen && tab === "Applications" && newCount > 0 && (
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${isActive ? "bg-blue-400/30 text-blue-200" : "bg-blue-500 text-white"}`}>
                    {newCount}
                  </span>
                )}
                {sidebarOpen && tab === "Messages" && unreadMsgCount > 0 && (
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${isActive ? "bg-rose-400/30 text-rose-200" : "bg-rose-500 text-white"}`}>
                    {unreadMsgCount}
                  </span>
                )}
                {/* Collapsed badge dots */}
                {!sidebarOpen && tab === "Applications" && newCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-blue-400 rounded-full" />
                )}
                {!sidebarOpen && tab === "Messages" && unreadMsgCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Settings + Profile ───────────────────────────────────────────── */}
        <div className="border-t border-white/10 p-3 space-y-1">
          {sidebarOpen && (
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 pb-1">Account</p>
          )}

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            title={!sidebarOpen ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all duration-150
              ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"}`}
          >
            <Settings className="h-4 w-4 shrink-0 text-white/50" />
            {sidebarOpen && <span className="flex-1 text-left">Settings</span>}
            {sidebarOpen && (
              <ChevronRight className={`h-3.5 w-3.5 text-white/30 transition-transform ${settingsOpen ? "rotate-90" : ""}`} />
            )}
          </button>

          {/* Settings panel */}
          {settingsOpen && sidebarOpen && (
            <div className="mx-1 p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Appearance</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    theme === "light"
                      ? "bg-white text-primary border-white"
                      : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" /> Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    theme === "dark"
                      ? "bg-white text-primary border-white"
                      : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" /> Dark
                </button>
              </div>
              {/* Language toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "zh" : "en")}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white transition-all"
              >
                <Globe className="h-3.5 w-3.5" />
                {language === "en" ? "Switch to 中文" : "切换到 EN"}
              </button>
            </div>
          )}

          {/* Profile card */}
          <div className={`flex items-center gap-3 rounded-xl p-2 mt-1 bg-white/5 border border-white/10
            ${sidebarOpen ? "" : "justify-center"}`}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-xs font-bold text-white uppercase">
                {displayName.slice(0, 2)}
              </span>
            </div>
            {sidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate leading-tight">{displayName}</p>
                  <p className="text-[11px] text-white/40">{t(`admin.role.${me.role}`)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/15 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Logout button when collapsed */}
          {!sidebarOpen && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-full flex justify-center py-2 rounded-xl text-white/40 hover:text-red-300 hover:bg-red-500/15 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="h-14 sm:h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-3 sm:px-5 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toggle button */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
            >
              <span className="lg:hidden">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </span>
              <ChevronRight className={`h-5 w-5 transition-transform hidden lg:block ${sidebarOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Page title */}
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {TAB_ICONS[activeTab]}
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {t(`admin.tab.${activeTab.toLowerCase()}`)}
                </h1>
                <p className="text-[11px] text-muted-foreground hidden sm:block leading-tight">
                  {t('admin.portal.name')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* New applications badge */}
            {newCount > 0 && (
              <button
                onClick={() => setActiveTab("Applications")}
                className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {newCount} new
              </button>
            )}
            {/* Unread messages badge */}
            {unreadMsgCount > 0 && (
              <button
                onClick={() => setActiveTab("Messages")}
                className="hidden sm:flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {unreadMsgCount}
              </button>
            )}
            {/* Mobile notification dots */}
            <div className="flex sm:hidden items-center gap-1">
              {newCount > 0 && (
                <button onClick={() => setActiveTab("Applications")} className="relative p-1.5">
                  <FileUser className="h-5 w-5 text-slate-400" />
                  <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-blue-500 rounded-full" />
                </button>
              )}
              {unreadMsgCount > 0 && (
                <button onClick={() => setActiveTab("Messages")} className="relative p-1.5">
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                  <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-rose-500 rounded-full" />
                </button>
              )}
            </div>
            {/* Avatar */}
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white uppercase">
                {displayName.slice(0, 2)}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-3 sm:p-6">

          {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
          {activeTab === "Overview" && (
            <div className="space-y-6 max-w-6xl">

              {/* Welcome banner */}
              <div className="relative bg-gradient-to-r from-primary via-primary to-blue-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/5" />
                <div className="absolute -bottom-8 right-16 h-24 w-24 rounded-full bg-white/5" />
                <div className="absolute top-4 right-32 h-12 w-12 rounded-full bg-white/5" />

                <div className="relative flex items-center gap-4">
                  {/* Avatar */}
                  <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                    <span className="text-xl font-bold text-white uppercase">
                      {displayName.slice(0, 2)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white/70 mb-0.5">{t('admin.overview.greeting')}</p>
                    <h2 className="text-2xl font-bold tracking-tight">{displayName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold bg-white/15 border border-white/20 px-2 py-0.5 rounded-full">
                        {t(`admin.role.${me.role}`)}
                      </span>
                      <span className="text-white/50 text-xs">{t('admin.portal.name')}</span>
                    </div>
                  </div>

                  {/* Stats summary on the right */}
                  <div className="ml-auto hidden md:flex items-center gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold">{openJobCount}</p>
                      <p className="text-xs text-white/60 mt-0.5">{t('admin.job.open')}</p>
                    </div>
                    <div className="w-px h-10 bg-white/20" />
                    <div>
                      <p className="text-2xl font-bold">{newCount}</p>
                      <p className="text-xs text-white/60 mt-0.5">{t('admin.overview.awaiting')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: t('admin.overview.total_jobs'),       value: jobs.length,         sub: `${openJobCount} ${t('admin.job.open').toLowerCase()}`, icon: Briefcase,  iconCls: "bg-blue-50 text-blue-600" },
                  { label: t('admin.overview.total_applicants'), value: applications.length, sub: t('admin.overview.all_time'),                           icon: Users,      iconCls: "bg-violet-50 text-violet-600" },
                  { label: t('admin.overview.new_apps'),         value: newCount,            sub: t('admin.overview.awaiting'),                           icon: TrendingUp, iconCls: "bg-emerald-50 text-emerald-600" },
                  { label: t('admin.overview.team_admins'),      value: admins.length,       sub: me.role === "super_admin" ? t('admin.overview.total_accounts') : t('admin.overview.super_only'), icon: UserPlus, iconCls: "bg-amber-50 text-amber-600" },
                ].map(({ label, value, sub, icon: Icon, iconCls }) => (
                  <Card key={label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconCls}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent activity grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Latest applications */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">{t('admin.overview.recent_apps')}</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-primary" onClick={() => setActiveTab("Applications")}>
                      {t('admin.view_all')} <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {applications.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground text-sm">{t('admin.overview.no_apps')}</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {applications.slice(0, 5).map((app) => (
                          <div key={app.id} className="px-5 py-3 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-slate-500 uppercase">{app.fullName.slice(0, 2)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{app.fullName}</p>
                              <p className="text-xs text-muted-foreground truncate">{app.position}</p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_CLS[app.status]}`}>
                              {t(`admin.status.${app.status}`)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active jobs */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">{t('admin.overview.active_jobs')}</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-primary" onClick={() => setActiveTab("Jobs")}>
                      {t('admin.manage')} <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {jobs.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground text-sm">{t('admin.overview.no_jobs')}</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {jobs.slice(0, 5).map((job) => {
                          const isExpired = new Date(job.deadline + "T23:59:59") < new Date();
                          return (
                            <div key={job.id} className="px-5 py-3 flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Briefcase className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{job.title}</p>
                                <p className="text-xs text-muted-foreground">{job.location} · {job.type}</p>
                              </div>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${isExpired ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                                {isExpired ? t('admin.job.expired') : t('admin.job.open')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ── JOBS ──────────────────────────────────────────────────────────── */}
          {activeTab === "Jobs" && (
            <div className="space-y-5 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{t('admin.jobs.title')}</h2>
                  <p className="text-sm text-muted-foreground">{jobs.length} · {openJobCount} {t('admin.job.open').toLowerCase()}</p>
                </div>
                <Button onClick={openCreateJob} className="gap-2 shadow-sm">
                  <Plus className="h-4 w-4" /> {t('admin.jobs.post_new')}
                </Button>
              </div>

              {jobs.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700 mb-1">{t('admin.jobs.empty_title')}</p>
                    <p className="text-sm text-muted-foreground mb-6">{t('admin.jobs.empty_desc')}</p>
                    <Button onClick={openCreateJob} className="gap-2"><Plus className="h-4 w-4" /> {t('admin.jobs.post_first')}</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const isExpired = new Date(job.deadline + "T23:59:59") < new Date();
                    const appCount = applications.filter((a) => a.jobId?.title === job.title).length;
                    return (
                      <Card key={job.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4 flex-1 min-w-0">
                              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Briefcase className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <h3 className="font-bold text-slate-800">{job.title}</h3>
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isExpired ? "bg-slate-100 text-slate-500" : job.status === "open" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                                    {isExpired ? t('admin.job.expired') : job.status === "open" ? t('admin.job.open') : t('admin.job.closed')}
                                  </span>
                                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{job.type}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{job.location}</p>
                                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{job.description}</p>
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {t('admin.jobs.deadline')} <strong className={isExpired ? "text-red-500" : "text-slate-700"}>{new Date(job.deadline).toLocaleDateString(language === "zh" ? "zh-CN" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}</strong>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {language === "zh" ? `${appCount} 位申请人` : `${appCount} applicant${appCount !== 1 ? "s" : ""}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => openEditJob(job)} title="Edit">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 hover:border-red-200" onClick={() => deleteJobMutation.mutate(job.id)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── APPLICATIONS ──────────────────────────────────────────────────── */}
          {activeTab === "Applications" && (() => {
            // Group applications by job title
            const filteredApps = appStatusFilter === "all"
              ? applications
              : applications.filter(a => a.status === appStatusFilter);

            // Build ordered groups: jobs that exist in the jobs list first, then "Other"
            const groupMap = new Map<string, { jobId?: number; apps: Application[] }>();
            filteredApps.forEach(app => {
              const key = app.jobId?.title || app.position || "Other Applications";
              if (!groupMap.has(key)) groupMap.set(key, { jobId: app.jobId?.id, apps: [] });
              groupMap.get(key)!.apps.push(app);
            });
            const groups = Array.from(groupMap.entries());

            const statusColors: Record<string, string> = {
              all: "bg-slate-800 text-white border-transparent",
              new: "bg-blue-600 text-white border-transparent",
              reviewed: "bg-amber-500 text-white border-transparent",
              shortlisted: "bg-emerald-600 text-white border-transparent",
              rejected: "bg-red-500 text-white border-transparent",
            };
            const statusInactive: Record<string, string> = {
              all: "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
              new: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
              reviewed: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
              shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
              rejected: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
            };

            const totalGroupPages = Math.ceil(groups.length / APP_GROUPS_PER_PAGE);
            const pagedGroups = groups.slice((appGroupPage - 1) * APP_GROUPS_PER_PAGE, appGroupPage * APP_GROUPS_PER_PAGE);

            return (
              <div className="space-y-5 max-w-5xl">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('admin.applications.title')}</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredApps.length} application{filteredApps.length !== 1 ? "s" : ""} across {groups.length} position{groups.length !== 1 ? "s" : ""} · {newCount} {t('admin.overview.awaiting')}
                    </p>
                  </div>
                  {applications.filter(a => a.status === "rejected").length > 0 && (
                    <Button
                      variant="outline" size="sm"
                      className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        const rejected = applications.filter(a => a.status === "rejected");
                        if (window.confirm(`Delete all ${rejected.length} rejected applications? This cannot be undone.`)) {
                          rejected.forEach(a => deleteApplicationMutation.mutate(a.id));
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete All Rejected ({applications.filter(a => a.status === "rejected").length})
                    </Button>
                  )}
                </div>

                {/* Status filter pills */}
                <div className="flex flex-wrap gap-2">
                  {(["all","new","reviewed","shortlisted","rejected"] as const).map(s => {
                    const count = s === "all" ? applications.length : applications.filter(a => a.status === s).length;
                    if (count === 0 && s !== "all") return null;
                    const active = appStatusFilter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setAppStatusFilter(s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${active ? statusColors[s] : statusInactive[s]}`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)} ({count})
                      </button>
                    );
                  })}
                </div>

                {applications.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="py-16 text-center">
                      <div className="h-16 w-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                        <FileUser className="h-8 w-8 text-violet-500" />
                      </div>
                      <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">{t('admin.applications.empty_title')}</p>
                      <p className="text-sm text-muted-foreground">{t('admin.applications.empty_desc')}</p>
                    </CardContent>
                  </Card>
                ) : groups.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="py-12 text-center">
                      <p className="text-slate-500">No applications match this filter.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Page info */}
                    {totalGroupPages > 1 && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <span>
                          Showing positions {(appGroupPage - 1) * APP_GROUPS_PER_PAGE + 1}–{Math.min(appGroupPage * APP_GROUPS_PER_PAGE, groups.length)} of {groups.length}
                        </span>
                        <span>Page {appGroupPage} of {totalGroupPages}</span>
                      </div>
                    )}
                    {pagedGroups.map(([groupTitle, { apps }]) => {
                      const isCollapsed = collapsedGroups.has(groupTitle);
                      const shortlisted = apps.filter(a => a.status === "shortlisted").length;
                      const newApps = apps.filter(a => a.status === "new").length;

                      return (
                        <div key={groupTitle} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                          {/* Group header */}
                          <button
                            onClick={() => toggleGroup(groupTitle)}
                            className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Briefcase className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{groupTitle}</p>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <span className="text-xs text-muted-foreground">{apps.length} applicant{apps.length !== 1 ? "s" : ""}</span>
                                  {newApps > 0 && (
                                    <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{newApps} new</span>
                                  )}
                                  {shortlisted > 0 && (
                                    <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{shortlisted} shortlisted</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ${isCollapsed ? "" : "rotate-90"}`} />
                          </button>

                          {/* Applicants */}
                          {!isCollapsed && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                              {apps.map(app => (
                                <div key={app.id} className={`px-5 py-4 bg-white dark:bg-slate-800 ${app.status === "rejected" ? "opacity-70" : ""}`}>
                                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Avatar + name */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold uppercase ${
                                        app.status === "shortlisted" ? "bg-emerald-100 text-emerald-600" :
                                        app.status === "rejected" ? "bg-red-100 text-red-500" :
                                        app.status === "reviewed" ? "bg-amber-100 text-amber-600" :
                                        "bg-violet-100 text-violet-600"
                                      }`}>
                                        {app.fullName.slice(0, 2)}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{app.fullName}</p>
                                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CLS[app.status]}`}>
                                            {t(`admin.status.${app.status}`)}
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.email}</span>
                                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{app.phone}</span>
                                          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />
                                            {new Date(app.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                      <Button
                                        size="sm" variant="outline"
                                        className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5 h-8 text-xs"
                                        onClick={() => downloadCV(app.id)}
                                      >
                                        <Download className="h-3.5 w-3.5" /> CV
                                      </Button>
                                      <Select value={app.status} onValueChange={val => statusMutation.mutate({ id: app.id, status: val })}>
                                        <SelectTrigger className="h-8 w-32 text-xs">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">{t('admin.status.new')}</SelectItem>
                                          <SelectItem value="reviewed">{t('admin.status.reviewed')}</SelectItem>
                                          <SelectItem value="shortlisted">{t('admin.status.shortlisted')}</SelectItem>
                                          <SelectItem value="rejected">{t('admin.status.rejected')}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        size="sm" variant="outline"
                                        className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50"
                                        onClick={() => {
                                          if (window.confirm(`Delete ${app.fullName}'s application?`)) {
                                            deleteApplicationMutation.mutate(app.id);
                                          }
                                        }}
                                        disabled={deleteApplicationMutation.isPending}
                                        title="Delete"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Application groups pagination */}
                    {totalGroupPages > 1 && (
                      <div className="pt-2 border-t border-slate-100">
                        <Pager page={appGroupPage} total={totalGroupPages} onChange={(p) => { setAppGroupPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── MESSAGES ──────────────────────────────────────────────────────── */}
          {activeTab === "Messages" && (() => {
            const totalMsgPages = Math.ceil(contacts.length / MSGS_PER_PAGE);
            const pagedContacts = contacts.slice((msgPage - 1) * MSGS_PER_PAGE, msgPage * MSGS_PER_PAGE);
            return (
            <div className="space-y-5 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Contact Messages</h2>
                  <p className="text-sm text-muted-foreground">
                    {contacts.length} total · {unreadMsgCount} unread
                  </p>
                </div>
              </div>

              {contacts.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-rose-400" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700 mb-1">No messages yet</p>
                    <p className="text-sm text-muted-foreground">Messages from the contact form will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {/* Page info */}
                  {totalMsgPages > 1 && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                      <span>
                        Showing {(msgPage - 1) * MSGS_PER_PAGE + 1}–{Math.min(msgPage * MSGS_PER_PAGE, contacts.length)} of {contacts.length} messages
                      </span>
                      <span>Page {msgPage} of {totalMsgPages}</span>
                    </div>
                  )}
                  {pagedContacts.map((msg) => (
                    <Card key={msg.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${!msg.read ? "border-l-4 border-l-rose-400" : ""}`}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${!msg.read ? "bg-rose-100" : "bg-slate-100"}`}>
                              <span className={`text-sm font-bold uppercase ${!msg.read ? "text-rose-600" : "text-slate-500"}`}>
                                {msg.name.slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <p className="font-semibold text-slate-800">{msg.name}</p>
                                {!msg.read && (
                                  <span className="text-[11px] font-semibold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">New</span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{msg.email}</span>
                                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(msg.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                              <p className="text-sm font-medium text-slate-700 mb-1">{msg.subject}</p>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 shrink-0 sm:ml-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
                              onClick={() => { setReplyDialog({ open: true, contact: msg }); setReplyMessage(""); }}
                            >
                              <Reply className="h-3.5 w-3.5" /> Reply
                            </Button>
                            {!msg.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-slate-600 dark:text-slate-300"
                                onClick={() => markReadMutation.mutate(msg.id)}
                                disabled={markReadMutation.isPending}
                              >
                                <Eye className="h-3.5 w-3.5" /> Mark read
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                if (confirm("Delete this message? This cannot be undone.")) {
                                  deleteContactMutation.mutate(msg.id);
                                }
                              }}
                              disabled={deleteContactMutation.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Messages pagination */}
                  {totalMsgPages > 1 && (
                    <div className="pt-2 border-t border-slate-100">
                      <Pager page={msgPage} total={totalMsgPages} onChange={(p) => { setMsgPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                    </div>
                  )}
                </div>
              )}
            </div>
            );
          })()}

          {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
          {activeTab === "Testimonials" && (
            <div className="space-y-5 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Client Testimonials</h2>
                  <p className="text-sm text-muted-foreground">
                    {testimonials.length} total · {testimonials.filter((t) => t.active).length} visible on website
                  </p>
                </div>
                <Button className="gap-2 shadow-sm" onClick={() => { setEditingTestimonial(null); setTestimonialForm(EMPTY_TESTIMONIAL); setTestimonialDialogOpen(true); }}>
                  <Plus className="h-4 w-4" /> Add Testimonial
                </Button>
              </div>

              {testimonials.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-amber-400" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">No testimonials yet</p>
                    <p className="text-sm text-muted-foreground mb-6">Add real client feedback to display on your website.</p>
                    <Button className="gap-2" onClick={() => { setEditingTestimonial(null); setTestimonialForm(EMPTY_TESTIMONIAL); setTestimonialDialogOpen(true); }}>
                      <Plus className="h-4 w-4" /> Add First Testimonial
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <Card key={t.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${!t.active ? "opacity-60" : ""}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary uppercase">{t.name.slice(0, 2)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100">{t.name}</p>
                                <p className="text-xs text-primary font-medium">{t.role ? `${t.role} · ` : ""}{t.company}</p>
                              </div>
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${t.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                                {t.active ? "Visible" : "Hidden"}
                              </span>
                            </div>
                            {/* Stars */}
                            <div className="flex gap-0.5 mb-2">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`h-3.5 w-3.5 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                              ))}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-3">"{t.quote}"</p>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                          <Button
                            size="sm" variant="outline"
                            className={`text-xs gap-1 ${t.active ? "text-slate-500" : "text-emerald-600 border-emerald-200"}`}
                            onClick={() => toggleTestimonialMutation.mutate({ id: t.id, active: !t.active })}
                          >
                            {t.active ? <X className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                            {t.active ? "Hide" : "Show"}
                          </Button>
                          <Button
                            size="sm" variant="outline" className="text-xs gap-1"
                            onClick={() => {
                              setEditingTestimonial(t);
                              setTestimonialForm({ name: t.name, role: t.role, company: t.company, quote: t.quote, rating: t.rating, order: t.order });
                              setTestimonialDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </Button>
                          <Button
                            size="sm" variant="outline"
                            className="text-xs gap-1 text-red-500 hover:bg-red-50 hover:border-red-200"
                            onClick={() => deleteTestimonialMutation.mutate(t.id)}
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ADMINS ────────────────────────────────────────────────────────── */}
          {activeTab === "Admins" && me.role === "super_admin" && (
            <div className="space-y-5 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{t('admin.admins.title')}</h2>
                <p className="text-sm text-muted-foreground">{admins.length} {t('admin.overview.total_accounts')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Admin list */}
                <Card className="lg:col-span-2 border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t('admin.admins.all')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {admins.map((admin) => (
                        <div key={admin.id} className="px-5 py-4 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary uppercase">{admin.username.slice(0, 2)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-slate-800 truncate">{admin.username}</p>
                              {admin.id === me.id && (
                                <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{t('admin.admins.you')}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${admin.role === "super_admin" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"}`}>
                                {t(`admin.role.${admin.role}`)}
                              </span>
                              {admin.mustChangePassword
                                ? <span className="text-[11px] text-amber-600 flex items-center gap-1"><Clock className="h-3 w-3" />{t('admin.admins.pending')}</span>
                                : <span className="text-[11px] text-emerald-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />{t('admin.admins.active')}</span>}
                            </div>
                          </div>
                          <button
                            disabled={admin.id === me.id}
                            onClick={() => deleteAdminMutation.mutate(admin.id)}
                            title={admin.id === me.id ? t('admin.admins.cant_remove') : t('admin.admins.remove')}
                            className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Create admin form */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-primary" /> {t('admin.admins.add')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); createAdminMutation.mutate(newAdmin); }} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.field.username')}</Label>
                        <Input
                          placeholder="e.g. John Doe"
                          className="h-10"
                          value={newAdmin.username}
                          onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.field.email')}</Label>
                        <Input
                          type="email"
                          placeholder="admin@company.com"
                          className="h-10"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          required
                        />
                        <p className="text-[11px] text-muted-foreground">{t('admin.admins.invite_hint')}</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.field.role')}</Label>
                        <Select value={newAdmin.role} onValueChange={(v) => setNewAdmin({ ...newAdmin, role: v })}>
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t('admin.role.admin')}</SelectItem>
                            <SelectItem value="super_admin">{t('admin.role.super_admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full gap-2 shadow-sm" disabled={createAdminMutation.isPending}>
                        {createAdminMutation.isPending
                          ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('admin.admins.creating')}</>
                          : <><Plus className="h-4 w-4" /> {t('admin.admins.create_btn')}</>}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Reply Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={replyDialog.open} onOpenChange={(open) => setReplyDialog({ open, contact: replyDialog.contact })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Reply className="h-5 w-5 text-primary" /> Reply to {replyDialog.contact?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-1 text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-14 shrink-0">To:</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">{replyDialog.contact?.email}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-14 shrink-0">Subject:</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">Re: {replyDialog.contact?.subject}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Your Reply</Label>
              <Textarea
                placeholder="Write your reply here..."
                className="min-h-[160px] resize-none"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setReplyDialog({ open: false, contact: null })}>Cancel</Button>
            <Button
              className="gap-2"
              disabled={!replyMessage.trim() || replyMutation.isPending}
              onClick={() => replyDialog.contact && replyMutation.mutate({ id: replyDialog.contact.id, message: replyMessage })}
            >
              {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Reply className="h-4 w-4" />}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Testimonial create / edit dialog ─────────────────────────────────── */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-amber-400" />
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveTestimonialMutation.mutate(testimonialForm); }} className="space-y-4 mt-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Client Name *</Label>
                <Input placeholder="e.g. Sarah Jenkins" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Company *</Label>
                <Input placeholder="e.g. TechFlow Inc." value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Role / Position</Label>
              <Input placeholder="e.g. HR Manager (optional)" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Rating</Label>
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button" onClick={() => setTestimonialForm({ ...testimonialForm, rating: s })}>
                    <Star className={`h-6 w-6 transition-colors ${s <= testimonialForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Testimonial Quote *</Label>
              <Textarea
                placeholder="Write what the client said about WZM HR services..."
                className="min-h-[120px] resize-none"
                value={testimonialForm.quote}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2" disabled={saveTestimonialMutation.isPending}>
                {saveTestimonialMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                {editingTestimonial ? "Save Changes" : "Add Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Job create / edit dialog ──────────────────────────────────────────── */}
      <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{editingJob ? t('admin.dialog.edit_job') : t('admin.dialog.new_job')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJobSubmit} className="space-y-4 mt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.dialog.job_title')}</Label>
                <Input placeholder="e.g. HR Manager" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.dialog.location')}</Label>
                <Input placeholder="e.g. Kigali, Rwanda" value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.dialog.job_type')}</Label>
                <Select value={jobForm.type} onValueChange={(v) => setJobForm({ ...jobForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{JOB_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.dialog.status')}</Label>
                <Select value={jobForm.status} onValueChange={(v) => setJobForm({ ...jobForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">{t('admin.job.open')}</SelectItem>
                    <SelectItem value="closed">{t('admin.job.closed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.dialog.deadline')}</Label>
              <Input type="date" value={jobForm.deadline} onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.dialog.description')}</Label>
              <Textarea
                placeholder={t('admin.dialog.desc_ph')}
                className="min-h-[120px] resize-none"
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setJobDialogOpen(false)}>{t('admin.dialog.cancel')}</Button>
              <Button type="submit" disabled={saveJobMutation.isPending}>
                {saveJobMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                {editingJob ? t('admin.dialog.save') : t('admin.dialog.post')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
