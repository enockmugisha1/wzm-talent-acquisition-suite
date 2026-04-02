import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { MapPin, Briefcase, Clock, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  deadline: string;
  status: string;
  posted: string;
}

export default function Jobs() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: jobs = [], isLoading, isError } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("jobs.title")}</h1>
          <div className="w-20 h-1 bg-accent rounded-full mb-8"></div>

          <div className="max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by job title or location..."
              className="h-14 pl-12 pr-4 rounded-xl border-border bg-white shadow-sm text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              </div>
            ) : isError ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <p className="text-destructive font-medium">Failed to load jobs. Please try again.</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-2 h-full ${job.status === "open" ? "bg-secondary" : "bg-muted-foreground"}`}></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h2>
                        {job.status === "open" ? (
                          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-0">Open</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">Closed</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1 text-accent font-medium">
                          <Clock className="h-4 w-4" />
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-none">
                        {job.description}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex-shrink-0">
                      {job.status === "open" ? (
                        <Link href={`/apply?position=${encodeURIComponent(job.title)}&jobId=${job._id}&deadline=${job.deadline}`}>
                          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white shadow-sm">
                            {t("jobs.apply")}
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled variant="outline" className="w-full md:w-auto cursor-not-allowed">
                          {t("jobs.closed")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <Search className="h-12 w-12 text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
