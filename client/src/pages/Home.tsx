import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Briefcase, User, Users, FileText, ClipboardCheck, MessageSquare, BookOpen, Building2, ChevronLeft, ChevronRight as ChevronRightIcon, Play, Award, TrendingUp, Globe2 } from "lucide-react";
import teamGroupImage from "@/assets/images/team-group.jpg";
import teamLaptopImage from "@/assets/images/team-laptop.jpg";
import teamDuoImage from "@/assets/images/team-duo.jpg";
import teamMember1 from "@/assets/images/team-member-1.jpg";
import teamMember2 from "@/assets/images/team-member-2.jpg";
import teamMember4 from "@/assets/images/team-member-4.jpg";
import teamMember5 from "@/assets/images/team-member-5.jpg";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

const heroSlides = [
  "/slide1.jpg", "/slide2.jpg", "/slide3.jpg",
  "/slide4.jpg", "/slide5.jpg", "/slide6.jpg",
  "/slide7.jpg", "/slide8.jpg", "/slide9.jpg",
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
};

const childFade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [heroIdx, setHeroIdx] = useState(0);
  const [heroDir, setHeroDir] = useState(1);

  const heroNext = useCallback(() => {
    setHeroDir(1);
    setHeroIdx((i) => (i + 1) % heroSlides.length);
  }, []);

  const heroPrev = () => {
    setHeroDir(-1);
    setHeroIdx((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const id = setInterval(heroNext, 4000);
    return () => clearInterval(id);
  }, [heroNext]);

  const services = [
    { icon: <BookOpen className="h-8 w-8" />, title: "home.services.training", desc: "services.training.desc", image: teamMember2, accent: "from-blue-600/80 to-primary/90" },
    { icon: <Users className="h-8 w-8" />, title: "home.services.dispatch", desc: "services.dispatch.desc", image: teamMember1, accent: "from-primary/80 to-slate-800/90" },
    { icon: <Building2 className="h-8 w-8" />, title: "home.services.outsourcing", desc: "services.outsourcing.desc", image: teamMember5, accent: "from-slate-700/80 to-primary/90" },
    { icon: <Briefcase className="h-8 w-8" />, title: "home.services.recruitment", desc: "services.recruitment.desc", image: teamMember4, accent: "from-primary/70 to-blue-800/90" }
  ];

  const steps = [
    { icon: <FileText className="h-6 w-6" />, label: "home.process.step1" },
    { icon: <ClipboardCheck className="h-6 w-6" />, label: "home.process.step2" },
    { icon: <MessageSquare className="h-6 w-6" />, label: "home.process.step3" },
    { icon: <Briefcase className="h-6 w-6" />, label: "home.process.step4" },
    { icon: <User className="h-6 w-6" />, label: "home.process.step5" }
  ];

  const stats = [
    { icon: <Award className="h-6 w-6" />, value: "200+", label: "Client Companies" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "90%+", label: "Client Renewal Rate" },
    { icon: <Globe2 className="h-6 w-6" />, value: "4.8/5", label: "Satisfaction Score" },
    { icon: <Users className="h-6 w-6" />, value: "5+", label: "Countries Served" },
  ];

  return (
    <MainLayout>
      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[100svh] sm:min-h-[92vh] flex items-center bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroImageY, opacity: heroOpacity }}
        >
          <img
            src={teamGroupImage}
            alt="WZM Team"
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-primary/70 to-slate-900/60" />
        </motion.div>

        {/* Animated blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-56 h-56 bg-primary/30 rounded-full blur-2xl animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="text-white"
            >
              <motion.p variants={childFade} className="text-accent font-bold text-sm tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
                <span className="inline-block h-px w-8 bg-accent" />
                WZM HUMAN RESOURCE SOLUTION CO. LTD
              </motion.p>
              <motion.h1 variants={childFade} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                {t("hero.title")}
              </motion.h1>
              <motion.p variants={childFade} className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-xl">
                {t("hero.subtitle")}
              </motion.p>
              <motion.div variants={childFade} className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">

                {/* ── Browse Jobs — gold ping + scale pump ── */}
                <Link href="/jobs">
                  <div className="relative inline-flex">
                    {/* Expanding ping ring 1 */}
                    <motion.span
                      animate={{ scale: [1, 1.55, 1.55], opacity: [0.7, 0, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-accent pointer-events-none"
                    />
                    {/* Expanding ping ring 2 — offset */}
                    <motion.span
                      animate={{ scale: [1, 1.55, 1.55], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                      className="absolute inset-0 rounded-full bg-accent pointer-events-none"
                    />
                    {/* Button itself — bounces */}
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Button size="lg" className="relative h-14 px-8 text-base bg-accent hover:bg-accent/90 text-primary font-extrabold shadow-2xl shadow-accent/40 rounded-full">
                        {t("hero.browse_jobs")}
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                          className="ml-2 inline-flex"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.span>
                      </Button>
                    </motion.div>
                  </div>
                </Link>

                {/* ── Submit CV — glowing border pulse ── */}
                <Link href="/apply">
                  <div className="relative inline-flex">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.04, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="absolute inset-0 rounded-full border-2 border-white/60 pointer-events-none"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    >
                      <Button size="lg" variant="outline" className="h-14 px-8 text-base border-2 border-white/50 text-white hover:bg-white/10 hover:border-white rounded-full font-semibold backdrop-blur-sm">
                        {t("hero.submit_cv")}
                      </Button>
                    </motion.div>
                  </div>
                </Link>

                {/* ── Request Staff — shimmer pulse ── */}
                <Link href="/contact">
                  <div className="relative inline-flex overflow-hidden rounded-full">
                    {/* Shimmer sweep */}
                    <motion.span
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
                      className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] pointer-events-none z-10"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                      className="absolute inset-0 rounded-full border-2 border-accent/60 pointer-events-none"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    >
                      <Button size="lg" className="relative h-14 px-8 text-base bg-white/15 hover:bg-white/25 text-white border-2 border-white/30 rounded-full font-semibold backdrop-blur-sm">
                        Request Staff
                        <Users className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </Link>

              </motion.div>
            </motion.div>

            {/* Hero Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative block mt-6 lg:mt-0"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-accent/30 to-primary/30 rounded-[2.5rem] blur-xl" />
              <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl ring-1 ring-white/10 h-[220px] sm:h-[320px] lg:h-[480px] bg-[#e8eaed]">

                {/* Crossfade slides */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={heroIdx}
                    src={heroSlides[heroIdx]}
                    alt="WZM Team"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-contain object-top"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

                {/* Prev / Next arrows */}
                <button
                  onClick={heroPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={heroNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 z-20">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setHeroDir(i > heroIdx ? 1 : -1); setHeroIdx(i); }}
                      className={`rounded-full transition-all duration-300 ${i === heroIdx ? "bg-accent w-5 h-2" : "bg-white/50 hover:bg-white/80 w-2 h-2"}`}
                    />
                  ))}
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-10 sm:bottom-14 left-4 sm:left-6 z-20 bg-white/95 backdrop-blur rounded-2xl px-4 sm:px-5 py-2 sm:py-3 shadow-xl flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Our Team</p>
                    <p className="text-sm font-bold text-foreground">5+ Countries Served</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs"
        >
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="py-8 px-6 text-center flex flex-col items-center gap-2"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                  {stat.icon}
                </div>
                <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── For Employers / For Candidates ─── */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Who We Serve</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Connecting Both Sides</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">

            {/* ── For Employers ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[320px] sm:min-h-[420px] flex flex-col justify-end"
            >
              {/* Background image */}
              <img
                src={teamDuoImage}
                alt="For Employers"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-800/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Floating icon badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 left-6 h-14 w-14 rounded-2xl bg-accent/90 backdrop-blur flex items-center justify-center shadow-xl shadow-accent/30"
              >
                <Briefcase className="h-7 w-7 text-primary" />
              </motion.div>

              {/* Stat badge top-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute top-6 right-6 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-center"
              >
                <p className="text-white font-extrabold text-lg leading-none">200+</p>
                <p className="text-white/70 text-xs">Client Companies</p>
              </motion.div>

              {/* Content */}
              <div className="relative z-10 p-8">
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">For Businesses</p>
                <h3 className="text-2xl font-extrabold text-white mb-3">{t("home.employers.title")}</h3>
                <p className="text-white/75 text-sm leading-relaxed mb-6 group-hover:text-white/90 transition-colors">
                  {t("home.employers.desc")}
                </p>
                <Link href="/contact">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-bold px-6 py-3 rounded-xl shadow-lg shadow-accent/30 transition-colors text-sm"
                  >
                    {t("home.employers.btn")}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* ── For Candidates ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[320px] sm:min-h-[420px] flex flex-col justify-end"
            >
              {/* Background image */}
              <img
                src={teamLaptopImage}
                alt="For Candidates"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/97 via-primary/60 to-primary/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Floating icon badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute top-6 left-6 h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl"
              >
                <User className="h-7 w-7 text-white" />
              </motion.div>

              {/* Stat badge top-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute top-6 right-6 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-center"
              >
                <p className="text-white font-extrabold text-lg leading-none">90%+</p>
                <p className="text-white/70 text-xs">Renewal Rate</p>
              </motion.div>

              {/* Excited team preview — mid card */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
                  <p className="text-white text-xs font-semibold text-center">🚀 New jobs posted daily</p>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">For Job Seekers</p>
                <h3 className="text-2xl font-extrabold text-white mb-3">{t("home.candidates.title")}</h3>
                <p className="text-white/75 text-sm leading-relaxed mb-6 group-hover:text-white/90 transition-colors">
                  {t("home.candidates.desc")}
                </p>
                <Link href="/jobs">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-primary font-bold px-6 py-3 rounded-xl shadow-lg transition-colors text-sm"
                  >
                    {t("home.candidates.btn")}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="py-14 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("home.services.title")}</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                style={{ minHeight: 280 }}
              >
                {/* Background image */}
                <img
                  src={service.image}
                  alt={t(service.title)}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                {/* Default overlay — dark gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${service.accent} opacity-75 group-hover:opacity-90 transition-opacity duration-500`} />

                {/* Shimmer line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-7 justify-end">
                  {/* Icon bubble — top */}
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="absolute top-6 left-6 h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-primary group-hover:border-accent transition-all duration-300 shadow-lg"
                  >
                    {service.icon}
                  </motion.div>

                  {/* Text block at bottom */}
                  <div className="pt-14">
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                      {t(service.title)}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed line-clamp-3 group-hover:text-white/90 transition-colors duration-300">
                      {t(service.desc)}
                    </p>
                    {/* Learn more — slides up on hover */}
                    <div className="mt-4 flex items-center gap-2 text-accent text-sm font-semibold opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <ArrowRight className="h-4 w-4" />
                      Learn more
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About Preview (team-laptop) ─── */}
      <section className="py-14 sm:py-24 bg-gradient-to-br from-slate-50 to-primary/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl group">
                <img
                  src={teamLaptopImage}
                  alt="WZM Team at work"
                  className="w-full h-[240px] sm:h-[340px] lg:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-6 py-4 shadow-xl border border-border"
              >
                <p className="text-xs text-muted-foreground">Collaboration</p>
                <p className="text-sm font-bold text-primary">Team-first culture</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Your Trusted HR Partner Across Africa
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                {t("about.desc")}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Part of TRUTEE Group (Hong Kong, est. 2021), WZM HR Solution was established in 2025 to deliver one-stop integrated HR services for SMEs across Tanzania, Rwanda, Uganda, Kenya, and Saudi Arabia.
              </p>
              <Link href="/about">
                <Button className="bg-primary hover:bg-primary/90 text-white px-7 h-12 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Recruitment Process ─── */}
      <section className="py-16 sm:py-28 text-white overflow-hidden relative">
        {/* Background image with overlay */}
        <img
          src={teamGroupImage}
          alt="WZM Team"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-slate-900/95" />
        {/* Dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        {/* Glowing orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("home.process.title")}</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          </motion.div>

          <div className="relative">
            {/* Animated connecting line */}
            <div className="hidden md:block absolute top-[3.25rem] left-[10%] right-[10%] h-px bg-white/10 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
                className="h-full bg-gradient-to-r from-accent/60 via-white/40 to-accent/60 origin-left"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  {/* Step circle */}
                  <motion.div
                    whileHover={{ scale: 1.15, y: -6 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    className="relative h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center mb-5 text-accent shadow-xl group-hover:bg-accent/20 group-hover:border-accent group-hover:shadow-accent/30 transition-all duration-300"
                  >
                    {/* Pulse ring on hover */}
                    <span className="absolute inset-0 rounded-full border-2 border-accent/40 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                    {step.icon}
                  </motion.div>

                  {/* Number badge */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-primary font-extrabold text-xs mb-3 shadow-lg shadow-accent/30"
                  >
                    {index + 1}
                  </motion.div>

                  <h3 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors uppercase tracking-wide">
                    {t(step.label)}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Meet the Team Teaser (team-duo) ─── */}
      <section className="py-14 sm:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1"
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our People</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Driven by Passion, Defined by Results
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                Our consultants bring deep local knowledge combined with global best practices to deliver HR solutions that actually work for you.
              </p>
              <ul className="space-y-3 mb-8">
                {["Experienced recruitment specialists & HRBPs", "Payroll, tax, and legal compliance experts", "Deep understanding of African labor & tax laws", "Serving Tanzania, Rwanda, Uganda, Kenya & Saudi Arabia"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <div className="h-5 w-5 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
                      <Play className="h-2.5 w-2.5 fill-accent" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link href="/about">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 h-12 px-7 rounded-xl">
                  Meet Our Full Team <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl group">
                <img
                  src={teamDuoImage}
                  alt="WZM Leadership"
                  className="w-full h-[240px] sm:h-[340px] lg:h-[460px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <div className="bg-white/95 backdrop-blur rounded-2xl px-5 py-4 shadow-xl">
                    <p className="text-xs text-muted-foreground mb-1">Leadership</p>
                    <p className="font-bold text-foreground text-sm">WZM Core Team — Kigali, Rwanda</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Our Clients Marquee ─── */}
      <section className="py-10 sm:py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Trusted Partners</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Companies We Have Served</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-3" />
            <p className="text-muted-foreground text-base">Verified by Client Testimonials — Nearly 200 companies across Africa &amp; beyond</p>
          </motion.div>
        </div>

        {/* Scrolling logo strip */}
        <div className="relative w-full overflow-hidden select-none">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10 bg-gradient-to-l from-white to-transparent" />

          <div className="flex animate-marquee w-max gap-5">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-5 items-center">
                {[
                  { name: "CJIC",               sub: "State-Owned Enterprise", img: "/Picture1.png" },
                  { name: "HAOJIN MOTO",        sub: "Trade",                  img: "/Picture2.png" },
                  { name: "COTTI COFFEE",       sub: "Trade",                  img: "/Picture3.png" },
                  { name: "CHENYANG",           sub: "Transportation",          img: "/Picture4.png" },
                  { name: "FOREVER TVET",       sub: "Education",               img: "/Picture5.png" },
                  { name: "OBOR",               sub: "Construction",            img: "/Picture6.png" },
                  { name: "CIMC",               sub: "Transportation",          img: "/Picture7.png" },
                  { name: "HENG SHENG",         sub: "Industry",               img: "/Picture8.png" },
                  { name: "WEST CHINA CEMENT",  sub: "Construction",            img: "/Picture9.png" },
                  { name: "HAOJUE",             sub: "Trade",                  img: "/Picture10.png" },
                  { name: "YITIAN",             sub: "Transportation",          img: "/Picture11.png" },
                  { name: "GORILLA TRADES",     sub: "Finance",                 img: "/Picture12.png" },
                  { name: "KEVLA",              sub: "Industry",               img: "/Picture13.png" },
                ].map((client) => (
                  <motion.div
                    key={`${setIdx}-${client.name}`}
                    whileHover={{ y: -5, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default border border-slate-100"
                    style={{ width: 130, height: 84 }}
                  >
                    <img
                      src={client.img}
                      alt={client.name}
                      className="max-h-11 max-w-[110px] w-auto h-auto object-contain"
                    />
                    <span className="text-[9px] font-medium mt-1 text-slate-400 text-center px-2 leading-tight">
                      {client.sub}
                    </span>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row below logos */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: "200+", label: "Client Companies", sub: "across 5+ countries" },
              { value: "90%+", label: "Client Renewal Rate", sub: "3 consecutive years" },
              { value: "4.8/5", label: "Satisfaction Score", sub: "average rating" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <p className="text-3xl font-extrabold text-primary mb-1">{stat.value}</p>
                <p className="font-semibold text-foreground text-sm">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-slate-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
            Ready to Build Your Dream Team?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Whether you're looking for top talent or your next great opportunity, WZM is your trusted HR partner in Rwanda and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="h-14 px-10 bg-accent hover:bg-accent/90 text-primary font-bold shadow-xl hover:scale-105 transition-all duration-300">
                Get In Touch <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="h-14 px-10 border-2 border-white/40 text-white hover:bg-white/10 hover:border-white transition-all duration-300">
                Browse Open Jobs
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
