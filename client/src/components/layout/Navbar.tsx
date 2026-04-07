import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import logoImage from "@/assets/images/logo-light.png";

export default function Navbar() {
  const [location] = useLocation();
  const { t, language, setLanguage } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  const navLinks = [
    { href: "/", label: "nav.home" },
    { href: "/about", label: "nav.about" },
    { href: "/services", label: "nav.services" },
    { href: "/jobs", label: "nav.jobs" },
    { href: "/apply", label: "nav.apply" },
    { href: "/contact", label: "nav.contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoImage} alt="WZM Logo" className="h-10 sm:h-14 w-auto object-contain" />
              <span className="text-xl font-bold text-primary hidden sm:block tracking-tight">WZM HR</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t(link.label)}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center border-l border-border pl-6 gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 font-medium"
                >
                  <Globe className="h-4 w-4" />
                  {language === 'en' ? '中文' : 'EN'}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="flex items-center gap-1 font-medium px-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? '中文' : 'EN'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  location === link.href
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}