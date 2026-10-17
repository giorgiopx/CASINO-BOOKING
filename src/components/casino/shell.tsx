import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useCasino } from "./context";
import { useAuth } from "./auth";
import "./visual-home.css";
import "./visual-more.css";

export function Brand() {
  const { t } = useCasino();
  return (
    <Link to="/" className="cb-logo" aria-label="CasinoBooking.com">
      <span className="cb-spade" aria-hidden="true">
        ♠
      </span>
      <span>
        <strong>CasinoBooking.com</strong>
        <small>
          {t(
            "CASINOS · RESORTS · CRUISES · TRAVEL",
            "ΚΑΖΙΝΟ · ΘΕΡΕΤΡΑ · ΚΡΟΥΑΖΙΕΡΕΣ · ΤΑΞΙΔΙΑ",
          )}
        </small>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { t, lang, setLang } = useCasino();
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = useLocation({ select: (location) => location.pathname });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const nav = [
    { en: "Home", el: "Αρχική", href: "/" },
    { en: "Casinos", el: "Καζίνο", href: "/explore" },
    { en: "Destinations", el: "Προορισμοί", href: "/destinations" },
    {
      en: "Casino Cruises",
      el: "Κρουαζιέρες",
      href: "/services",
      hash: "cruises",
    },
    { en: "Travel Concierge", el: "Οργάνωση Ταξιδιού", href: "/services" },
    { en: "Free Concierge", el: "Δωρεάν Concierge", href: "/request" },
    { en: "About Us", el: "Σχετικά", href: "/about" },
    { en: "Contact", el: "Επικοινωνία", href: "/contact" },
  ] as const;
  return (
    <header className="cb-design cb-visual-topbar cb-shell-header">
      <Brand />
      <nav
        id="site-navigation"
        className={open ? "cb-nav cb-nav-open" : "cb-nav"}
        aria-label={t("Main navigation", "Κύρια πλοήγηση")}
      >
        {nav.map((n) => (
          <Link
            key={n.en}
            to={n.href}
            hash={"hash" in n ? n.hash : ""}
            activeOptions={{ exact: true }}
            onClick={() => setOpen(false)}
          >
            {t(n.en, n.el)}
          </Link>
        ))}
        <Link
          className="cb-mobile-account"
          to={session ? "/dashboard" : "/auth"}
          onClick={() => setOpen(false)}
        >
          {t(
            session ? "My account" : "Login / Register",
            session ? "Ο λογαριασμός μου" : "Σύνδεση / Εγγραφή",
          )}
        </Link>
      </nav>
      <div className="cb-top-actions">
        <button
          type="button"
          className="cb-language"
          onClick={() => setLang(lang === "el" ? "en" : "el")}
          aria-label={t("Switch to Greek", "Αλλαγή σε αγγλικά")}
        >
          <span aria-hidden="true">{lang === "el" ? "🇬🇷" : "🇬🇧"}</span>{" "}
          {lang.toUpperCase()} <span aria-hidden="true">⌄</span>
        </button>
        {session ? (
          <Link className="cb-register" to="/dashboard">
            {t("My account", "Ο λογαριασμός μου")}
          </Link>
        ) : (
          <>
            <Link className="cb-login" to="/auth">
              {t("Login", "Σύνδεση")}
            </Link>
            <Link
              className="cb-register"
              to="/auth"
              search={{ mode: "signup" }}
            >
              {t("Register", "Εγγραφή")}
            </Link>
          </>
        )}
        <button
          ref={toggle}
          type="button"
          className="cb-menu-toggle"
          aria-controls="site-navigation"
          aria-expanded={open}
          aria-label={t(
            open ? "Close menu" : "Open menu",
            open ? "Κλείσιμο μενού" : "Άνοιγμα μενού",
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

export function Disclaimer() {
  const { t } = useCasino();
  return (
    <>
      {t(
        "CasinoBooking.com provides independent destination information and free travel enquiries. Supplier arrangements are confirmed separately; no live prices, availability or casino partnerships are implied. We do not process payments or gambling transactions. Adults only (18+ or the higher local minimum); local laws and entry requirements apply.",
        "Το CasinoBooking.com παρέχει ανεξάρτητη ενημέρωση προορισμών και δωρεάν ταξιδιωτικά αιτήματα. Οι διευθετήσεις με παρόχους επιβεβαιώνονται χωριστά· δεν υπονοούνται ζωντανές τιμές, διαθεσιμότητα ή συνεργασίες καζίνο. Δεν επεξεργαζόμαστε πληρωμές ή συναλλαγές τζόγου. Μόνο ενήλικες (18+ ή το υψηλότερο τοπικό όριο)· ισχύουν τοπικοί νόμοι και όροι εισόδου.",
      )}
    </>
  );
}

export function SiteFooter() {
  const { t } = useCasino();
  return (
    <footer className="cb-design cb-extra cb-extra-footer cb-shell-footer">
      <div className="cb-extra-footer-top">
        <div className="cb-extra-footer-brand">
          <Link to="/">♠ CasinoBooking.com</Link>
          <small>
            {t(
              "CASINOS · RESORTS · CRUISES · TRAVEL",
              "ΚΑΖΙΝΟ · ΘΕΡΕΤΡΑ · ΚΡΟΥΑΖΙΕΡΕΣ · ΤΑΞΙΔΙΑ",
            )}
          </small>
          <p>
            {t(
              "Independent destination research and free travel enquiries for adults. No confirmed partner relationships or live travel inventory are implied.",
              "Ανεξάρτητη ενημέρωση προορισμών και δωρεάν ταξιδιωτικά αιτήματα για ενήλικες. Δεν υπονοούνται επιβεβαιωμένες συνεργασίες ή ζωντανή διαθεσιμότητα.",
            )}
          </p>
        </div>
        <div>
          <h3>{t("Explore", "Εξερεύνηση")}</h3>
          <Link to="/destinations">
            {t("All destinations", "Όλοι οι προορισμοί")}
          </Link>
          <Link to="/explore">{t("Casino directory", "Κατάλογος καζίνο")}</Link>
          <Link to="/global-casinos">
            {t("International casinos", "Διεθνή καζίνο")}
          </Link>
        </div>
        <div>
          <h3>{t("Your Journey", "Το ταξίδι σας")}</h3>
          <Link to="/request">{t("Free travel enquiry", "Δωρεάν αίτημα")}</Link>
          <Link to="/auth">{t("Login / Register", "Σύνδεση / Εγγραφή")}</Link>
          <Link to="/dashboard">{t("My account", "Ο λογαριασμός μου")}</Link>
        </div>
        <div>
          <h3>{t("Information", "Πληροφορίες")}</h3>
          <Link to="/about">{t("About", "Σχετικά")}</Link>
          <Link to="/contact">{t("Contact", "Επικοινωνία")}</Link>
          <Link to="/privacy">{t("Privacy", "Απόρρητο")}</Link>
          <Link to="/terms">{t("Terms", "Όροι")}</Link>
        </div>
      </div>
      <p className="cb-footer-disclaimer">
        <Disclaimer />{" "}
        {t(
          "Gambling involves risk. Set limits and seek independent support if needed.",
          "Ο τζόγος ενέχει κίνδυνο. Θέστε όρια και αναζητήστε ανεξάρτητη υποστήριξη εάν χρειάζεται.",
        )}{" "}
        <a
          href="https://www.gamblingtherapy.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(
            "Responsible gambling support ↗",
            "Υποστήριξη υπεύθυνου παιχνιδιού ↗",
          )}
        </a>
      </p>
      <div className="cb-extra-footer-bottom">
        <span>© {new Date().getFullYear()} CasinoBooking.com</span>
        <span>
          {t(
            "Adults only · Travel enquiries · No online payments",
            "Μόνο ενήλικες · Ταξιδιωτικά αιτήματα · Χωρίς online πληρωμές",
          )}
        </span>
      </div>
    </footer>
  );
}
