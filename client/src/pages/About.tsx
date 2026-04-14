import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import teamLaptopImage from "@/assets/images/team-laptop.jpg";
import teamGroupImage from "@/assets/images/team-group.jpg";
import teamMember1 from "@/assets/images/team-member-1.jpg";
import teamMember2 from "@/assets/images/team-member-2.jpg";
import teamMember3 from "@/assets/images/team-member-3.jpg";
import teamMember4 from "@/assets/images/team-member-4.jpg";
import teamMember5 from "@/assets/images/team-member-5.jpg";
import teamMember6 from "@/assets/images/team-member-6.jpg";
import { Target, Eye, Heart, ShieldCheck, Zap, HeadphonesIcon, Trophy } from "lucide-react";

const whyUs = [
  {
    icon: <Trophy className="h-7 w-7" />,
    title: "Proven Track Record",
    desc: "500+ successful placements across industries — our results speak louder than promises.",
    color: "bg-amber-50 text-amber-600 border-amber-100"
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Trusted & Compliant",
    desc: "Fully licensed, labour-law compliant, and transparent in every engagement.",
    color: "bg-green-50 text-green-600 border-green-100"
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Fast Turnaround",
    desc: "We fill critical positions rapidly without compromising on candidate quality.",
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    icon: <HeadphonesIcon className="h-7 w-7" />,
    title: "Dedicated Support",
    desc: "A dedicated account manager stays with you from brief to onboarding and beyond.",
    color: "bg-purple-50 text-purple-600 border-purple-100"
  },
];

const mosaicPhotos = [teamMember5, teamMember1, teamMember6, teamMember3, teamMember2, teamMember4];

export default function About() {
  const { t } = useI18n();

  return (
    <MainLayout>
      {/* ─── Hero Banner ─── */}
      <div className="relative overflow-hidden min-h-[380px] flex items-end">
        <img
          src={teamGroupImage}
          alt="WZM Team"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-slate-900/60" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <span className="inline-block h-px w-8 bg-accent" /> Our Company
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 leading-tight">
              {t("about.title")}
            </h1>
            <div className="w-20 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* ─── Story Section ─── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Decorative */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl group">
                <img
                  src={teamLaptopImage}
                  alt="WZM Team collaborating"
                  className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating stat */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl px-6 py-4 border border-border"
              >
                <p className="text-xs text-muted-foreground">Founded</p>
                <p className="text-2xl font-extrabold text-primary">2019</p>
                <p className="text-xs text-muted-foreground">Kigali, Rwanda</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight">
                WZM HUMAN RESOURCE SOLUTION CO. LTD
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-5">
                {t("about.desc")}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Founded on the principle that people are a company's greatest asset, we strive to bridge the gap between exceptional talent and outstanding organizations — empowering careers and transforming businesses across Rwanda and beyond.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "500+", label: "Successful Placements" },
                  { value: "98%", label: "Client Satisfaction" },
                  { value: "10+", label: "Industries Served" },
                  { value: "50+", label: "Expert Consultants" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-slate-50 rounded-2xl p-4 text-center border border-border"
                  >
                    <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ─── Mission / Vision / Values ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                label: t("about.mission"),
                text: "To provide innovative human resource solutions that empower businesses to thrive and help individuals achieve their career aspirations.",
                bg: "bg-white border border-border",
                iconBg: "bg-primary/10 text-primary"
              },
              {
                icon: <Eye className="h-8 w-8" />,
                label: t("about.vision"),
                text: "To be the most trusted and preferred human resource partner in the region, recognized for our excellence and integrity.",
                bg: "bg-primary",
                iconBg: "bg-white/20 text-accent",
                dark: true
              },
              {
                icon: <Heart className="h-8 w-8" />,
                label: t("about.values"),
                text: "Integrity, Excellence, People-Centricity, Innovation, and Reliability in everything we do.",
                bg: "bg-white border border-border",
                iconBg: "bg-accent/20 text-accent"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className={`${card.bg} p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-center`}
              >
                <div className={`h-16 w-16 ${card.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  {card.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${card.dark ? "text-white" : ""}`}>{card.label}</h3>
                <p className={card.dark ? "text-white/85 leading-relaxed" : "text-muted-foreground leading-relaxed"}>
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ─── Why Choose WZM ─── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our Edge</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose WZM?</h2>
              <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                We don't just fill positions — we build lasting partnerships built on trust, speed, and real results.
              </p>
            </motion.div>

            {/* Why-us cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center mb-5 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* ─── Team Photo Mosaic ─── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden"
            >
              {/* Header overlay */}
              <div className="relative z-10 bg-primary px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Our People</p>
                  <h3 className="text-2xl font-extrabold text-white">The Faces Behind Every Placement</h3>
                </div>
                <p className="text-white/60 text-sm max-w-xs text-right">
                  Passionate HR professionals dedicated to connecting talent with opportunity across Rwanda.
                </p>
              </div>

              {/* Photo mosaic grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 h-64 sm:h-72">
                {mosaicPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 1.08 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.6 }}
                    whileHover={{ scale: 1.08, zIndex: 10 }}
                    className="relative overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt="WZM team member"
                      className="w-full h-full object-cover object-top group-hover:brightness-110 transition-all duration-500"
                    />
                    {/* Hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="h-1.5 w-8 bg-accent rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="bg-slate-900 px-10 py-5 flex items-center justify-between">
                <p className="text-slate-400 text-sm">WZM Human Resource Solution Co. Ltd — Kigali, Rwanda</p>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="h-2 w-2 rounded-full bg-accent"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
