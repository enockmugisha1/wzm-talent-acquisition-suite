import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const MAP_URL =
    "https://www.google.com/maps/place/WZM+Human+Resource+Solution.,LTD/@-1.938362,30.1204547,309m/data=!3m1!1e3!4m6!3m5!1s0x19dca7004ee161f1:0x2d3f1d5822a28ccb!8m2!3d-1.9380494!4d30.1210681!16s%2Fg%2F11xfmgb1dh?entry=ttu&g_ep=EgoyMDI2MDMwMS4xIKXMDSoASAFQAw%3D%3D";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    setIsSending(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      toast({ title: "Message Sent", description: "Your message has been received. We'll be in touch soon!" });
      (e.target as HTMLFormElement).reset();
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("contact.title")}</h1>
          <div className="w-20 h-1 bg-accent rounded-full"></div>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">{t("contact.get_in_touch")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {t("contact.get_in_touch_desc")}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{t("contact.location")}</h3>
                    <p className="text-muted-foreground mb-3">{t("contact.location_address")}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-primary border-primary hover:bg-primary/5"
                      onClick={() => window.open(MAP_URL, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("contact.get_directions")}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t("contact.phone")}</h3>
                    <p className="text-muted-foreground">+250796661213</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t("contact.email_label")}</h3>
                    <p className="text-muted-foreground">wmhrsolution@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t("contact.business_hours")}</h3>
                    <p className="text-muted-foreground">{t("contact.business_hours_weekdays")}</p>
                    <p className="text-muted-foreground">{t("contact.business_hours_saturday")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-border shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("contact.name")}</label>
                      <Input name="name" placeholder="Your name" className="h-12" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("contact.email")}</label>
                      <Input name="email" type="email" placeholder="Your email" className="h-12" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.subject")}</label>
                    <Input name="subject" placeholder={t("contact.subject_placeholder")} className="h-12" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.message")}</label>
                    <Textarea
                      name="message"
                      placeholder={t("contact.message_placeholder")}
                      className="min-h-[150px] resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-base bg-primary hover:bg-primary/90 text-white shadow-md"
                    disabled={isSending}
                  >
                    {isSending ? "Sending..." : t("contact.send")}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
