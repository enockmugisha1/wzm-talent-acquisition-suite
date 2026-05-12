import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Building2, Users, Briefcase, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import teamGroupImage from "@/assets/images/team-group.jpg";
import teamLaptopImage from "@/assets/images/team-laptop.jpg";
import teamMember5 from "@/assets/images/team-member-5.jpg";
import teamMember3 from "@/assets/images/team-member-3.jpg";

export default function Services() {
  const { t } = useI18n();

  const servicesList = [
    {
      icon: <Building2 className="h-10 w-10" />,
      title: "home.services.outsourcing",
      desc: "services.outsourcing.desc",
      image: teamMember5,
      imageAlt: "WZM HR Outsourcing Consultant",
      color: "from-primary/80 to-slate-800/80",
      features: [
        "Payroll Management",
        "Employee Records Administration",
        "Benefits Administration",
        "Labor Law Compliance",
        "HR Policy Development"
      ]
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "home.services.dispatch",
      desc: "services.dispatch.desc",
      image: teamLaptopImage,
      imageAlt: "WZM Labor Dispatch Team",
      color: "from-slate-800/80 to-primary/60",
      features: [
        "Temporary Staffing",
        "Contract Workers",
        "Seasonal Labor Solutions",
        "Project-Based Teams",
        "Risk Mitigation"
      ]
    },
    {
      icon: <Briefcase className="h-10 w-10" />,
      title: "home.services.recruitment",
      desc: "services.recruitment.desc",
      image: teamGroupImage,
      imageAlt: "WZM Recruitment Team",
      color: "from-primary/70 to-accent/40",
      features: [
        "Executive Search",
        "Mass Recruitment",
        "Candidate Screening",
        "Interview Facilitation",
        "Onboarding Support"
      ]
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "home.services.training",
      desc: "services.training.desc",
      image: teamMember3,
      imageAlt: "WZM Training Coordinator",
      color: "from-slate-700/80 to-primary/70",
      features: [
        "Leadership Development",
        "Performance Management",
        "Soft Skills Training",
        "Corporate Culture Workshops",
        "Team Building Activities"
      ]
    }
  ];

  return (
    <MainLayout>
      {/* ─── Hero Banner ─── */}
      <div className="relative overflow-hidden min-h-[220px] sm:min-h-[300px] lg:min-h-[360px] flex items-end">
        <img
          src={teamLaptopImage}
          alt="WZM Services"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-slate-900/70" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span className="inline-block h-px w-8 bg-accent" /> What We Do
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
              {t("services.title")}
            </h1>
            <div className="w-20 h-1 bg-accent rounded-full mb-4" />
            <p className="text-white/70 text-base sm:text-lg max-w-2xl">
              Comprehensive human resource solutions designed to optimize your workforce and drive business growth.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── Services List ─── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-24 lg:space-y-28">
            {servicesList.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 sm:gap-12 lg:gap-20 items-center`}
              >
                {/* Text side */}
                <div className="w-full lg:w-1/2">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-primary/10 text-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
                    {service.icon}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{t(service.title)}</h2>
                  <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                    {t(service.desc)}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {service.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 group"
                      >
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/contact">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-7 h-12 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Image side */}
                <div className="w-full lg:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl group h-[220px] sm:h-[320px] lg:h-[420px]"
                  >
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />

                    {/* Service label overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-6 left-6 right-6"
                    >
                      <div className="bg-white/95 backdrop-blur rounded-2xl px-5 py-4 shadow-xl flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          {service.icon}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{t(service.title)}</p>
                          <p className="text-xs text-muted-foreground">WZM HR Solution</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-14 sm:py-24 overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-slate-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Need a Custom HR Solution?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Every business is unique. Let us design a tailored HR strategy that fits your exact needs and budget.
          </p>
          <Link href="/contact">
            <Button size="lg" className="h-14 px-10 bg-accent hover:bg-accent/90 text-primary font-bold shadow-xl hover:scale-105 transition-all duration-300">
              Talk to an Expert <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </MainLayout>
  );
}
