import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  MapPin, Briefcase, Clock, Search, Loader2,
  X, ArrowRight, CalendarDays, Building2, ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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

function daysLeft(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return "Closes today";
  return `${diff}d left`;
}

export default function Jobs() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selected, setSelected] = useState<Job | null>(null);

  const { data: jobs = [], isLoading, isError } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

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

  return (
    <MainLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Career Opportunities</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("jobs.title")}</h1>
          <p className="text-white/70 text-lg mb-10 max-w-xl">Find the role that matches your skills and ambitions. New positions added regularly.</p>

          {/* Search */}
          <div className="max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by job title or location..."
              className="h-14 pl-12 pr-4 rounded-xl border-0 bg-white shadow-lg text-base text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  typeFilter === f
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto shrink-0 text-sm text-slate-400 whitespace-nowrap">
              {allFiltered.length} position{allFiltered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-12 bg-slate-50 min-h-[60vh]">
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
            <div className="flex gap-8 items-start">
              {/* Job list */}
              <div className={`flex-1 space-y-3 transition-all duration-300 ${selected ? "lg:max-w-[46%]" : "max-w-3xl mx-auto w-full"}`}>
                {allFiltered.map((job, i) => {
                  const isOpen = job.status === "open";
                  const remaining = daysLeft(job.deadline);
                  const isSelected = selected?.id === job.id;

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelected(isSelected ? null : job)}
                      className={`bg-white rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md group ${
                        isSelected
                          ? "border-primary shadow-md ring-1 ring-primary/20"
                          : "border-slate-200 hover:border-primary/40"
                      }`}
                    >
                      <div className="p-5 flex items-start gap-4">
                        {/* Icon */}
                        <div className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${isOpen ? "bg-primary/10" : "bg-slate-100"}`}>
                          <Briefcase className={`h-5 w-5 ${isOpen ? "text-primary" : "text-slate-400"}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h2 className={`font-bold text-base leading-tight mb-1 ${isSelected ? "text-primary" : "text-slate-800 group-hover:text-primary"} transition-colors`}>
                                {job.title}
                              </h2>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.type}</span>
                                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />
                                  {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {isOpen ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs">Open</Badge>
                              ) : (
                                <Badge className="bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-100 text-xs">Closed</Badge>
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
              </div>

              {/* Detail panel */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.25 }}
                    className="hidden lg:block flex-1 sticky top-20"
                  >
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                      {/* Header */}
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

                      {/* Meta pills */}
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

                      {/* Description */}
                      <div className="px-6 py-5 max-h-[42vh] overflow-y-auto">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Job Description</h3>
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                          {selected.description}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                        {selected.status === "open" ? (
                          <Link href={`/apply?position=${encodeURIComponent(selected.title)}&jobId=${selected.id}&deadline=${selected.deadline}`}>
                            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-semibold shadow-md">
                              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled className="w-full h-12 cursor-not-allowed" variant="outline">
                            Applications Closed
                          </Button>
                        )}
                        <p className="text-center text-xs text-slate-400 mt-3">
                          Submit your CV and cover letter to apply for this position
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile detail modal */}
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
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-6 mx-4 mt-2 rounded-2xl">
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
