import { useI18n } from "@/lib/i18n";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import aboutOfficeImage from "@/assets/images/about-office.jpg";
import { Target, Eye, Heart } from "lucide-react";

export default function About() {
  const { t } = useI18n();

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("about.title")}</h1>
          <div className="w-20 h-1 bg-accent rounded-full"></div>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={aboutOfficeImage} 
                alt="WZM Office" 
                className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-foreground">WZM HUMAN RESOURCE SOLUTION CO. LTD</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t("about.desc")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded on the principle that people are a company's greatest asset, we strive to bridge the gap between exceptional talent and outstanding organizations.
              </p>
            </motion.div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-card p-10 rounded-3xl border border-border shadow-sm text-center"
            >
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("about.mission")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide innovative human resource solutions that empower businesses to thrive and help individuals achieve their career aspirations.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-primary text-white p-10 rounded-3xl shadow-lg text-center"
            >
              <div className="h-16 w-16 bg-white/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("about.vision")}</h3>
              <p className="text-white/90 leading-relaxed">
                To be the most trusted and preferred human resource partner in the region, recognized for our excellence and integrity.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-card p-10 rounded-3xl border border-border shadow-sm text-center"
            >
              <div className="h-16 w-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("about.values")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                Integrity, Excellence, People-Centricity, Innovation, and Reliability in everything we do.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}