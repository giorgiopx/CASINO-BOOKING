import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Crown, Menu, X, Globe, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCasino } from "./context";
export function Brand() {
  return (
    <Link to="/" className="brand">
      <Crown size={28} strokeWidth={1.2} />
      <span>
        CasinoBooking<span className="text-gold">.com</span>
      </span>
    </Link>
  );
}
export function SiteHeader() {
  const { t, lang, setLang } = useCasino();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const links = [
    ["/explore", t("Explore casinos", "Καζίνο")],
    ["/destinations", t("Destinations", "Προορισμοί")],
    ["/services", t("Travel services", "Υπηρεσίες")],
    ["/how-it-works", t("How it works", "Πώς λειτουργεί")],
  ] as const;
  return (
    <header className="site-header">
      <div className="container-site header-inner">
        <Brand />
        <nav
          className="main-nav"
          aria-label={t("Main navigation", "Κύρια πλοήγηση")}
        >
          {links.map(([to, title]) => (
            <Link key={to} to={to}>
              {title}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="language">
            <Globe size={13} />
            <Button
              variant="ghost"
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
              className={lang === "en" ? "text-gold" : ""}
            >
              EN
            </Button>
            <span className="text-dark-muted">/</span>
            <Button
              variant="ghost"
              aria-pressed={lang === "el"}
              onClick={() => setLang("el")}
              className={lang === "el" ? "text-gold" : ""}
            >
              ΕΛ
            </Button>
          </div>
          <Link to="/dashboard" className="text-xs portal-link">
            {t("My account", "Ο λογαριασμός μου")}
          </Link>
          <Link to="/portal" className="text-xs portal-link">
            {t("Portal", "Πύλη")}
          </Link>
          <Button asChild className="request-header" size="sm">
            <Link to="/request">
              {t("Plan your trip", "Σχεδιάστε ταξίδι")}
              <ArrowUpRight />
            </Link>
          </Button>
          <Button
            className="mobile-toggle"
            variant="ghost"
            size="icon"
            aria-label={t("Toggle menu", "Μενού")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav className="mobile-menu">
            {links.map(([to, title]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}>
                {title}
              </Link>
            ))}
            <Link to="/request" onClick={() => setOpen(false)}>
              {t("Plan your trip", "Σχεδιάστε ταξίδι")}
            </Link>
            <Link to="/portal" onClick={() => setOpen(false)}>
              {t("Demo portal", "Πύλη επίδειξης")}
            </Link>
            <Link to="/about" onClick={() => setOpen(false)}>
              {t("About us", "Σχετικά με εμάς")}
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)}>
              {t("Contact", "Επικοινωνία")}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
export function Disclaimer() {
  const { t } = useCasino();
  return (
    <>
      {t(
        "CasinoBooking.com is an independent referral and travel coordination concept. No casino partnerships or commissions are confirmed until signed agreements. External bookings are made with third-party providers. We do not handle gambling transactions or casino deposits. Adults only (18+ or the higher local minimum); local laws and entry restrictions apply. Verify local legal status before travel, especially for Northern Cyprus and changing regulations.",
        "Το CasinoBooking.com είναι ανεξάρτητη ιδέα παραπομπών και ταξιδιωτικού συντονισμού. Συνεργασίες και προμήθειες δεν επιβεβαιώνονται χωρίς υπογεγραμμένες συμφωνίες. Οι κρατήσεις γίνονται με τρίτους παρόχους. Δεν διαχειριζόμαστε συναλλαγές τζόγου ή καταθέσεις καζίνο. Μόνο ενήλικες (18+ ή το υψηλότερο τοπικό όριο)· ισχύουν τοπικοί νόμοι και περιορισμοί εισόδου. Ελέγξτε το νομικό καθεστώς πριν ταξιδέψετε, ειδικά για τη Βόρεια Κύπρο και μεταβαλλόμενους κανονισμούς.",
      )}
    </>
  );
}
export function SiteFooter() {
  const { t } = useCasino();
  return (
    <footer className="site-footer">
      <div className="container-site">
        <div className="footer-grid">
          <div>
            <Brand />
            <p>
              {t(
                "Considered journeys. Personal coordination. A different way to discover your next destination.",
                "Προσεγμένα ταξίδια. Προσωπικός συντονισμός. Ένας διαφορετικός τρόπος να ανακαλύψετε τον επόμενο προορισμό σας.",
              )}
            </p>
          </div>
          <div>
            <h3>{t("Explore", "Ανακαλύψτε")}</h3>
            <div className="footer-links">
              <Link to="/explore">
                {t("Casino directory", "Κατάλογος καζίνο")}
              </Link>
              <Link to="/destinations">{t("Destinations", "Προορισμοί")}</Link>
              <Link to="/services">
                {t("Travel services", "Ταξιδιωτικές υπηρεσίες")}
              </Link>
              <Link to="/how-it-works">
                {t("How it works", "Πώς λειτουργεί")}
              </Link>
            </div>
          </div>
          <div>
            <h3>{t("CasinoBooking", "CasinoBooking")}</h3>
            <div className="footer-links">
              <Link to="/about">{t("Our approach", "Η προσέγγισή μας")}</Link>
              <Link to="/contact">{t("Contact us", "Επικοινωνία")}</Link>
              <Link to="/portal">{t("Demo portal", "Πύλη επίδειξης")}</Link>
              <Link to="/about">
                {t("Mobile app roadmap", "Σχέδιο εφαρμογής κινητού")}
              </Link>
            </div>
          </div>
          <div>
            <h3>{t("Your peace of mind", "Η ηρεμία σας")}</h3>
            <div className="footer-links">
              <Link to="/privacy">
                {t("Privacy · legal draft", "Απόρρητο · νομικό προσχέδιο")}
              </Link>
              <Link to="/terms">
                {t("Terms · legal draft", "Όροι · νομικό προσχέδιο")}
              </Link>
              <a
                href="https://www.gamblingtherapy.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(
                  "Responsible gambling support",
                  "Υποστήριξη υπεύθυνου παιχνιδιού",
                )}{" "}
                ↗
              </a>
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} />
                {t("Adults only · 18+", "Μόνο ενήλικες · 18+")}
              </span>
            </div>
          </div>
        </div>
        <p className="legal-footer">
          <Disclaimer />{" "}
          {t(
            "Gambling involves risk. Set limits, never chase losses, and seek support if needed.",
            "Ο τζόγος ενέχει κίνδυνο. Θέστε όρια, μην κυνηγάτε απώλειες και αναζητήστε υποστήριξη εάν χρειάζεται.",
          )}
        </p>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} CasinoBooking.com ·{" "}
            {t(
              "Frontend prototype · no live bookings",
              "Πρωτότυπο · χωρίς ζωντανές κρατήσεις",
            )}
          </span>
          <span>
            {t(
              "English / Ελληνικά · Designed for your journey",
              "English / Ελληνικά · Σχεδιασμένο για το ταξίδι σας",
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
