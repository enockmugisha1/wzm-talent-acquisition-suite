import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { Building2, Users, Briefcase, BookOpen, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
  const { t } = useI18n();

  const servicesList = [
    {
      icon: <Building2 className="h-10 w-10" />,
      title: "home.services.outsourcing",
      desc: "services.outsourcing.desc",
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
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("services.title")}</h1>
          <div className="w-20 h-1 bg-accent rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive human resource solutions designed to optimize your workforce and drive business growth.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {servicesList.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="h-20 w-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{t(service.title)}</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    {t(service.desc)}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2">
                  <div className="bg-muted rounded-[2.5rem] p-8 h-[400px] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 text-primary/20 transform group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}