import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Valid phone number required"),
  position: z.string().min(2, "Position is required"),
});

export default function Apply() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", phone: "", position: "" },
  });

  // Read query params: ?position=...&jobId=...&deadline=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const positionParam = params.get("position");
    const jobIdParam = params.get("jobId");
    const deadlineParam = params.get("deadline");

    if (positionParam) form.setValue("position", positionParam);
    if (jobIdParam) setJobId(jobIdParam);
    if (deadlineParam) {
      const deadline = new Date(deadlineParam + "T23:59:59");
      setDeadlinePassed(new Date() > deadline);
    }
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Only PDF or Word (.doc/.docx) files are accepted.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "CV must be under 5 MB.", variant: "destructive" });
      return;
    }
    setCvFile(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!cvFile) {
      toast({ title: "CV Required", description: "Please upload your CV (PDF or Word).", variant: "destructive" });
      return;
    }
    if (deadlinePassed) {
      toast({ title: "Deadline passed", description: "This job is no longer accepting applications.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("position", values.position);
      if (jobId) formData.append("jobId", jobId);
      formData.append("cv", cvFile);

      const res = await fetch("/api/applications", {
        method: "POST",
        credentials: "include",
        body: formData,   // multipart/form-data — no Content-Type header needed
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setIsSuccess(true);
      toast({ title: "Application Submitted!", description: "Our team will review your application and contact you soon." });
    } catch (err: any) {
      toast({ title: "Submission Failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-4xl font-bold text-primary mb-4">{t("apply.title")}</h1>
          <div className="w-20 h-1 bg-accent rounded-full"></div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          {/* Deadline passed banner */}
          {deadlinePassed && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Application deadline has passed</p>
                <p className="text-sm">This position is no longer accepting new applications.</p>
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="bg-white p-12 rounded-3xl border border-border shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Thank you for applying. Our recruitment team will review your application and contact you soon.
              </p>
              <Button onClick={() => window.location.href = "/jobs"} variant="outline" className="h-12 px-8">
                Return to Jobs
              </Button>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("apply.fullname")}</FormLabel>
                        <FormControl><Input placeholder="John Doe" className="h-12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("apply.email")}</FormLabel>
                        <FormControl><Input type="email" placeholder="john@example.com" className="h-12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("apply.phone")}</FormLabel>
                        <FormControl><Input placeholder="+1 234 567 8900" className="h-12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="position" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("apply.position")}</FormLabel>
                        <FormControl><Input placeholder="e.g. HR Manager" className="h-12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* CV Upload */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Label className="text-base font-semibold">
                      {t("apply.cv")} <span className="text-destructive">*</span>
                      <span className="ml-2 text-xs font-normal text-muted-foreground">(PDF or Word, max 5 MB)</span>
                    </Label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                        ${cvFile ? "border-primary/40 bg-primary/5" : "border-border hover:bg-muted/50"}`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {cvFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-10 w-10 text-primary" />
                          <p className="text-sm font-semibold text-primary">{cvFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(cvFile.size / 1024).toFixed(0)} KB &middot; Click to change</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload your CV / Resume</p>
                          <p className="text-xs text-muted-foreground">PDF or Word document up to 5 MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-md"
                    disabled={isSubmitting || deadlinePassed}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</>
                    ) : deadlinePassed ? "Deadline Passed" : t("apply.submit")}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
