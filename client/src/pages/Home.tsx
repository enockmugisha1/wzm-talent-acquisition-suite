import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Briefcase, User, Users, FileText, ClipboardCheck, MessageSquare, BookOpen, Building2 } from "lucide-react";
import heroTeamImage from "@/assets/images/hero-team.jpg";
import testimonialImage1 from "@/assets/images/testimonial_1.jpg";
import testimonialImage2 from "@/assets/images/testimonial_2.jpg";
import testimonialImage3 from "@/assets/images/testimonial_3.jpg";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useI18n();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const services = [
    { icon: <BookOpen className="h-8 w-8" />, title: "home.services.training", desc: "services.training.desc" },
    { icon: <Users className="h-8 w-8" />, title: "home.services.dispatch", desc: "services.dispatch.desc" },
    { icon: <Building2 className="h-8 w-8" />, title: "home.services.outsourcing", desc: "services.outsourcing.desc" },
    { icon: <Briefcase className="h-8 w-8" />, title: "home.services.recruitment", desc: "services.recruitment.desc" }
  ];

  const steps = [
    { icon: <FileText className="h-6 w-6" />, label: "home.process.step1" },
    { icon: <ClipboardCheck className="h-6 w-6" />, label: "home.process.step2" },
    { icon: <MessageSquare className="h-6 w-6" />, label: "home.process.step3" },
    { icon: <Briefcase className="h-6 w-6" />, label: "home.process.step4" },
    { icon: <User className="h-6 w-6" />, label: "home.process.step5" }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 pt-16 md:pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="max-w-2xl"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <h2 className="text-sm font-bold text-accent tracking-wider uppercase mb-3">
                WZM HUMAN RESOURCE SOLUTION CO. LTD
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight tracking-tight mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/jobs">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all">
                    {t("hero.browse_jobs")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-2 border-accent text-foreground hover:bg-accent/10 transition-all">
                    {t("hero.submit_cv")}
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>
              <img 
                src={heroTeamImage} 
                alt="Professional team meeting" 
                className="rounded-[2rem] shadow-2xl object-cover h-[500px] w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Employers / For Candidates */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-16 w-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("home.employers.title")}</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed h-16">
                {t("home.employers.desc")}
              </p>
              <Link href="/contact">
                <Button className="w-full sm:w-auto text-primary" variant="outline">
                  {t("home.employers.btn")}
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-16 w-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{t("home.candidates.title")}</h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed h-16">
                {t("home.candidates.desc")}
              </p>
              <Link href="/jobs">
                <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  {t("home.candidates.btn")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("home.services.title")}</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className="mx-auto h-16 w-16 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors rounded-2xl flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{t(service.title)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(service.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Process */}
      <section className="py-24 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("home.process.title")}</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-white/20"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur border-2 border-white/30 flex items-center justify-center mb-6 text-accent shadow-lg">
                    {step.icon}
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-primary font-bold text-sm mb-4 absolute top-[72px] right-1/2 translate-x-12 md:top-[-16px] md:right-auto md:translate-x-0 md:relative md:mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white/90">{t(step.label)}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("home.testimonials.title")}</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { image: testimonialImage1, name: "Sarah Jenkins", company: "TechFlow Inc.", quote: "WZM provided exceptional candidates that perfectly matched our company culture. Their process was seamless." },
              { image: testimonialImage2, name: "David Chen", company: "Global Logistics", quote: "The HR outsourcing service has saved us countless hours. Highly professional and reliable team." },
              { image: testimonialImage3, name: "Emily Rodriguez", company: "Retail Partners", quote: "Their management training program completely transformed our mid-level leadership. Outstanding results." }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="h-16 w-16 rounded-full object-cover shadow-sm" />
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-primary font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}