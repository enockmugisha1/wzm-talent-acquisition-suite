import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import teamLaptopImage from "@/assets/images/team-laptop.jpg";
import teamGroupImage from "@/assets/images/team-group.jpg";
import zhangFeifei from "@/assets/images/zhang-feifei.png";
import wanNina from "@/assets/images/wan-nina.png";
import muHaiyan from "@/assets/images/mu-haiyan.png";
import { Target, Eye, Heart, ShieldCheck, Zap, Users, Trophy } from "lucide-react";

const whyUs = [
  {
    icon: <Trophy className="h-7 w-7" />,
    title: "Compliance Assurance",
    desc: "Over 5 years of industry experience, fully compliant operations, and avoidance of employment risks.",
    color: "bg-amber-50 text-amber-600 border-amber-100"
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Cost Reduction & Efficiency",
    desc: "Streamlined HR processes that cut overhead costs and boost operational performance for your business.",
    color: "bg-green-50 text-green-600 border-green-100"
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Flexible Adaptation",
    desc: "From startups to mid-sized groups — we provide scalable, customized services that grow with you.",
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Technology Empowerment",
    desc: "Digital tools enhance management efficiency and unlock the strategic value of your HR team.",
    color: "bg-purple-50 text-purple-600 border-purple-100"
  },
];

const chineseTeam = [
  {
    photo: zhangFeifei,
    name: "Zhang Feifei",
    role: "Founder, TRUTEE Group",
    bio: "Founder of TRUTEE Group, African tax and labor expert proficient in the tax and labor laws of various African countries, with 8 years of deep experience in the field.",
  },
  {
    photo: wanNina,
    name: "Wan Nina",
    role: "Senior HR Director",
    bio: "Former senior executive at a leading domestic corporation, with nearly 20 years of human resources management experience. Proficient in the labor and tax laws of various African countries.",
  },
  {
    photo: muHaiyan,
    name: "Mu Haiyan",
    role: "Operations & Compliance Lead",
    bio: "15 years of management experience at a well-known domestic international school, proficient in the labor and tax laws of various African countries.",
  },
];

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
                <p className="text-2xl font-extrabold text-primary">2025</p>
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
                Part of TRUTEE Group (Hong Kong, est. 2021), WZM HR Solution was established in 2025 to deliver one-stop integrated HR services for small and medium-sized enterprises operating across Tanzania, Rwanda, Uganda, Kenya, and Saudi Arabia.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "200+", label: "Client Companies" },
                  { value: "90%+", label: "Client Renewal Rate" },
                  { value: "4.8/5", label: "Satisfaction Score" },
                  { value: "5+", label: "Countries Served" },
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
                text: "We are committed to delivering advanced human resource solutions tailored for SMEs — providing strategic compensation management, comprehensive employee benefits, robust risk management, and customized technical support to create measurable value for our clients.",
                bg: "bg-white border border-border",
                iconBg: "bg-primary/10 text-primary"
              },
              {
                icon: <Eye className="h-8 w-8" />,
                label: t("about.vision"),
                text: "We deliver advanced HR solutions for SMEs covering compensation, benefits, risk management, and technical support. Guided by innovation, integrity, and collaboration, we create client value, unlock talent potential, and ensure businesses not only survive but thrive in competitive markets.",
                bg: "bg-primary",
                iconBg: "bg-white/20 text-accent",
                dark: true
              },
              {
                icon: <Heart className="h-8 w-8" />,
                label: t("about.values"),
                text: "Customer First · Innovation and Progress · Collaboration for Mutual Success · Integrity in Professionalism",
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

            {/* ─── Chinese Professional Team ─── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-primary rounded-3xl px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Our People</p>
                  <h3 className="text-2xl font-extrabold text-white">Professional Chinese Team</h3>
                </div>
                <p className="text-white/60 text-sm max-w-xs text-right">
                  Experienced specialists in African labor law, HR management, and tax compliance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {chineseTeam.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.55 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border group"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-foreground mb-0.5">{member.name}</h4>
                      <p className="text-primary text-sm font-semibold mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-2xl px-10 py-5 flex items-center justify-between mt-8">
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
