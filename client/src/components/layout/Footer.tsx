import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { Mail, MapPin, Phone, Briefcase } from "lucide-react";
import logoImage from "@/assets/images/logo-dark.png";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Main grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <img src={logoImage} alt="WZM Logo" className="h-14 w-auto object-contain" />
              <div>
                <p className="text-white font-bold text-sm leading-tight">WZM HR Solution</p>
                <p className="text-slate-500 text-xs">Human Resource Co. Ltd</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional HR outsourcing, management training, labor dispatch, and recruitment services.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="mailto:wmhrsolution@gmail.com" className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-primary border border-slate-700 hover:border-primary flex items-center justify-center transition-all" title="Email us">
                <Mail className="h-4 w-4" />
              </a>
              <a href="tel:+250796661213" className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-primary border border-slate-700 hover:border-primary flex items-center justify-center transition-all" title="Call us">
                <Phone className="h-4 w-4" />
              </a>
              <Link href="/jobs" className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-primary border border-slate-700 hover:border-primary flex items-center justify-center transition-all" title="Open jobs">
                <Briefcase className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-5">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                t("home.services.outsourcing"),
                t("home.services.dispatch"),
                t("home.services.recruitment"),
                t("home.services.training"),
              ].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="h-px w-4 bg-slate-700 group-hover:bg-primary group-hover:w-5 transition-all" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-5">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: t("nav.home"),    href: "/" },
                { label: t("nav.about"),   href: "/about" },
                { label: t("nav.jobs"),    href: "/jobs" },
                { label: t("nav.apply"),   href: "/apply" },
                { label: t("nav.contact"), href: "/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="h-px w-4 bg-slate-700 group-hover:bg-primary group-hover:w-5 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-5">
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Address</p>
                  <p className="text-slate-300">WZM Human Resource Solution.,LTD</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Phone</p>
                  <a href="tel:+250796661213" className="text-slate-300 hover:text-white transition-colors">+250796661213</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Email</p>
                  <a href="mailto:wmhrsolution@gmail.com" className="text-slate-300 hover:text-white transition-colors">wmhrsolution@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} WZM Human Resource Solution Co. Ltd. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs font-medium tracking-wide italic">
            "{t("hero.title")}"
          </p>
        </div>
      </div>
    </footer>
  );
}
