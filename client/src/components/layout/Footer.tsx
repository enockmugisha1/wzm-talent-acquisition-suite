import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";
import logoImage from "@/assets/images/logo.png";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-white border-t border-border/40 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="WZM Logo" className="h-10 w-auto object-contain grayscale opacity-80" />
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {t("hero.subtitle").substring(0, 100)}...
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              {t("nav.services")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("home.services.outsourcing")}</li>
              <li>{t("home.services.dispatch")}</li>
              <li>{t("home.services.recruitment")}</li>
              <li>{t("home.services.training")}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-primary transition-colors">
                  {t("nav.jobs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              {t("nav.contact")}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Business Avenue, Tech District, City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@wzmhr.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WZM HUMAN RESOURCE SOLUTION CO. LTD. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            {t("hero.title")}
          </p>
        </div>
      </div>
    </footer>
  );
}