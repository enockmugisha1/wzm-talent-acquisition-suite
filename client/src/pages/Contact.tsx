import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import teamDuoImage from "@/assets/images/team-duo.jpg";

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
      {/* ─── Hero Banner ─── */}
      <div className="relative overflow-hidden min-h-[320px] flex items-end">
        <img
          src={teamDuoImage}
          alt="WZM Contact"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-slate-900/60" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span className="inline-block h-px w-8 bg-accent" /> Reach Out
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
              {t("contact.title")}
            </h1>
            <div className="w-20 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* ─── Contact Info ─── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Team photo card */}
              <div className="relative overflow-hidden rounded-3xl shadow-xl group mb-2">
                <img
                  src={teamDuoImage}
                  alt="WZM Team"
                  className="w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm">We're here to help</p>
                  <p className="text-white/70 text-xs">WZM HR Solution Team</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">{t("contact.get_in_touch")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("contact.get_in_touch_desc")}
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: <MapPin className="h-5 w-5" />,
                    title: t("contact.location"),
                    content: t("contact.location_address"),
                    extra: (
                      <Button variant="outline" size="sm" className="mt-2 gap-2 text-primary border-primary hover:bg-primary/5"
                        onClick={() => window.open(MAP_URL, "_blank")}>
                        <ExternalLink className="h-4 w-4" /> {t("contact.get_directions")}
                      </Button>
                    )
                  },
                  {
                    icon: <Phone className="h-5 w-5" />,
                    title: t("contact.phone"),
                    content: "+250 796 661 213  |  +177 867 275 95  |  +158 714 146 06"
                  },
                  {
                    icon: <Mail className="h-5 w-5" />,
                    title: t("contact.email_label"),
                    content: "wmhrsolution@gmail.com"
                  },
                  {
                    icon: <Clock className="h-5 w-5" />,
                    title: t("contact.business_hours"),
                    content: t("contact.business_hours_weekdays"),
                    sub: t("contact.business_hours_saturday")
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-0.5">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.content}</p>
                      {item.sub && <p className="text-muted-foreground text-sm">{item.sub}</p>}
                      {item.extra}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ─── Contact Form ─── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3"
            >
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-border shadow-lg">
                <h3 className="text-2xl font-bold mb-2">Send us a Message</h3>
                <p className="text-muted-foreground text-sm mb-8">Fill in the form and our team will get back to you within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">{t("contact.name")}</label>
                      <Input name="name" placeholder="Your name" className="h-12 rounded-xl border-border/60 focus:border-primary transition-colors" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">{t("contact.email")}</label>
                      <Input name="email" type="email" placeholder="Your email" className="h-12 rounded-xl border-border/60 focus:border-primary transition-colors" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t("contact.subject")}</label>
                    <Input name="subject" placeholder={t("contact.subject_placeholder")} className="h-12 rounded-xl border-border/60 focus:border-primary transition-colors" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">{t("contact.message")}</label>
                    <Textarea
                      name="message"
                      placeholder={t("contact.message_placeholder")}
                      className="min-h-[160px] resize-none rounded-xl border-border/60 focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      className="w-full h-14 text-base bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg rounded-xl transition-all duration-300"
                      disabled={isSending}
                    >
                      {isSending ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full"
                          />
                          Sending...
                        </span>
                      ) : t("contact.send")}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
