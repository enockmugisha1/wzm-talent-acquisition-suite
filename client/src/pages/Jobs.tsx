import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  MapPin, Briefcase, Clock, Search, Loader2,
  X, ArrowRight, CalendarDays, Building2, ChevronRight,
  ChevronLeft, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  description: string;
  deadline: string;
  status: string;
  posted: string;
}

const TYPE_FILTERS = ["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"];
const JOBS_PER_PAGE = 9;

function daysLeft(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return "Closes today";
  return `${diff}d left`;
}

function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  // Build page number list: show at most 5 pages around current
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
      <button
        onClick={() => onChange(1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="h-9 w-9 flex items-center justify-center text-slate-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all ${
              p === page
                ? "bg-primary text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Jobs() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selected, setSelected] = useState<Job | null>(null);
  const [page, setPage] = useState(1);

  const { data: jobs = [], isLoading, isError } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  // Reset to page 1 whenever search or filter changes, also clear selection
  useEffect(() => {
    setPage(1);
    setSelected(null);
  }, [searchTerm, typeFilter]);

  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "All" || job.type === typeFilter;
    return matchSearch && matchType;
  });

  const openJobs = filtered.filter((j) => j.status === "open");
  const closedJobs = filtered.filter((j) => j.status !== "open");
  const allFiltered = [...openJobs, ...closedJobs];

  const totalPages = Math.max(1, Math.ceil(allFiltered.length / JOBS_PER_PAGE));
  const paginated = allFiltered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MainLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Career Opportunities</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">{t("jobs.title")}</h1>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl">Find the role that matches your skills and ambitions. New positions added regularly.</p>

          {/* Search */}
          <div className="max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by job title or location..."
              className="h-12 sm:h-14 pl-12 pr-4 rounded-xl border-0 bg-white shadow-lg text-base text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 sm:py-4 scrollbar-hide">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  typeFilter === f
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto shrink-0 text-sm text-slate-400 whitespace-nowrap pl-2">
              {allFiltered.length} position{allFiltered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-8 sm:py-12 bg-slate-50 min-h-[60vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-24">
              <p className="text-destructive font-medium">Failed to load jobs. Please try again.</p>
            </div>
          ) : allFiltered.length === 0 ? (
            <div className="text-center py-24">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No positions found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              {/* Page info */}
              <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                <span>
                  Showing {(page - 1) * JOBS_PER_PAGE + 1}–{Math.min(page * JOBS_PER_PAGE, allFiltered.length)} of {allFiltered.length} positions
                </span>
                {totalPages > 1 && (
                  <span>Page {page} of {totalPages}</span>
                )}
              </div>

              <div className="flex gap-6 lg:gap-8 items-start">
                {/* Job list */}
                <div className={`flex-1 space-y-3 transition-all duration-300 ${selected ? "lg:max-w-[46%]" : "max-w-3xl mx-auto w-full"}`}>
                  {paginated.map((job, i) => {
                    const isOpen = job.status === "open";
                    const remaining = daysLeft(job.deadline);
                    const isSelected = selected?.id === job.id;

                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.035 }}
                        onClick={() => setSelected(isSelected ? null : job)}
                        className={`bg-white rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md group ${
                          isSelected
                            ? "border-primary shadow-md ring-1 ring-primary/20"
                            : "border-slate-200 hover:border-primary/40"
                        }`}
                      >
                        <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                          <div className={`shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center ${isOpen ? "bg-primary/10" : "bg-slate-100"}`}>
                            <Briefcase className={`h-5 w-5 ${isOpen ? "text-primary" : "text-slate-400"}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h2 className={`font-bold text-sm sm:text-base leading-tight mb-1 ${isSelected ? "text-primary" : "text-slate-800 group-hover:text-primary"} transition-colors`}>
                                  {job.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{job.location}</span>
                                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3 shrink-0" />{job.type}</span>
                                  <span className="flex items-center gap-1 hidden sm:flex"><CalendarDays className="h-3 w-3 shrink-0" />
                                    {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isOpen ? (
                                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs hidden sm:flex">Open</Badge>
                                ) : (
                                  <Badge className="bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-100 text-xs hidden sm:flex">Closed</Badge>
                                )}
                                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isSelected ? "rotate-90 text-primary" : "group-hover:translate-x-0.5"}`} />
                              </div>
                            </div>

                            {remaining && isOpen && (
                              <div className="mt-2">
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                  <Clock className="h-3 w-3" />{remaining}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Pagination */}
                  <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
                </div>

                {/* Detail panel — desktop */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.22 }}
                      className="hidden lg:block flex-1 sticky top-20"
                    >
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-br from-primary to-primary/80 p-6 relative">
                          <button
                            onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                            <Briefcase className="h-6 w-6 text-white" />
                          </div>
                          <h2 className="text-xl font-bold text-white mb-1">{selected.title}</h2>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/70 text-sm mt-2">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selected.location}</span>
                            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{selected.type}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-slate-100">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${selected.status === "open" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                            {selected.status === "open" ? "Open" : "Closed"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            <CalendarDays className="h-3 w-3" />
                            Deadline: {new Date(selected.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          {selected.posted && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                              Posted: {new Date(selected.posted).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>

                        <div className="px-6 py-5 max-h-[42vh] overflow-y-auto">
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Job Description</h3>
                          <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{selected.description}</div>
                        </div>

                        <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                          {selected.status === "open" ? (
                            <Link href={`/apply?position=${encodeURIComponent(selected.title)}&jobId=${selected.id}&deadline=${selected.deadline}`}>
                              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold shadow-md">
                                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          ) : (
                            <Button disabled className="w-full h-12 cursor-not-allowed" variant="outline">Applications Closed</Button>
                          )}
                          <p className="text-center text-xs text-slate-400 mt-3">Submit your CV and cover letter to apply for this position</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Mobile bottom sheet */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-end lg:hidden"
                onClick={() => setSelected(null)}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-3 mb-1" />
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-5 mx-4 mt-2 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-1">{selected.title}</h2>
                    <div className="flex flex-wrap gap-x-4 text-white/70 text-sm">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selected.location}</span>
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{selected.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 px-4 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${selected.status === "open" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                      {selected.status === "open" ? "Open" : "Closed"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      <CalendarDays className="h-3 w-3" />
                      Deadline: {new Date(selected.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>

                  <div className="px-4 pb-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Job Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{selected.description}</p>
                  </div>

                  <div className="sticky bottom-0 bg-white border-t px-4 py-4">
                    {selected.status === "open" ? (
                      <Link href={`/apply?position=${encodeURIComponent(selected.title)}&jobId=${selected.id}&deadline=${selected.deadline}`}>
                        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold">
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full h-12" variant="outline">Applications Closed</Button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </MainLayout>
  );
}
