import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Valid phone number required"),
  position: z.string().min(2, "Position is required"),
});

export default function Apply() {
  const { t } = useI18n();
  const [locationUrl] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      position: "",
    },
  });

  // Extract position from URL query params if present
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const positionParam = searchParams.get('position');
    if (positionParam) {
      form.setValue('position', positionParam);
    }
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!cvFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV (PDF/DOCX).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Application Submitted",
        description: "Thank you! We have received your application.",
      });
    }, 1500);
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
          {isSuccess ? (
            <div className="bg-white p-12 rounded-3xl border border-border shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Application Successful!</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Thank you for applying. Our recruitment team will review your application and contact you soon.
              </p>
              <Button onClick={() => window.location.href = '/jobs'} variant="outline" className="h-12 px-8">
                Return to Jobs
              </Button>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("apply.fullname")}</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("apply.email")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("apply.phone")}</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 8900" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("apply.position")}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. HR Manager" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6 pt-4 border-t border-border">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        {t("apply.cv")} <span className="text-destructive">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                        <Input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          {cvFile ? cvFile.name : "Click or drag file to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF or DOCX up to 5MB
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        {t("apply.coverletter")}
                      </Label>
                      <Input type="file" accept=".pdf,.doc,.docx" className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : t("apply.submit")}
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