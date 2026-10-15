/**
 * CasinoBooking approved visual homepage.
 * Visual components re-create the user-provided reference using cropped elements
 * of the SAME original approved concept; no replacement destination photography.
 * The cards are editorial previews, NOT a verified inventory or partnership claim.
 * Assets required: public/design-reference/*.webp supplied in handoff ZIP.
 */
import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCasino } from "./context";
import {
  MapPin,
  CalendarDays,
  Users,
  Search,
  Plane,
  CarFront,
  Building2,
  Ship,
  ShieldCheck,
  Headset,
  ArrowRight,
  Menu,
  X,
  Globe2,
  Hotel,
  Dices,
  Crown,
  LockKeyhole,
} from "lucide-react";
import {
  approvedCountries,
  countryVenues,
} from "@/lib/approved-casino-directory";
import "./visual-home.css";

type Country = { name: string; el: string; flag: string; asset: string };
const destinations: Country[] = [
  { name: "Monaco", el: "Μονακό", flag: "🇲🇨", asset: "monaco" },
  { name: "Cyprus", el: "Κύπρος", flag: "🇨🇾", asset: "cyprus" },
  { name: "Greece", el: "Ελλάδα", flag: "🇬🇷", asset: "greece" },
  { name: "Italy", el: "Ιταλία", flag: "🇮🇹", asset: "italy" },
  { name: "France", el: "Γαλλία", flag: "🇫🇷", asset: "france" },
  { name: "Spain", el: "Ισπανία", flag: "🇪🇸", asset: "spain" },
  { name: "Portugal", el: "Πορτογαλία", flag: "🇵🇹", asset: "portugal" },
  { name: "Serbia", el: "Σερβία", flag: "🇷🇸", asset: "serbia" },
  { name: "Romania", el: "Ρουμανία", flag: "🇷🇴", asset: "romania" },
  { name: "Slovenia", el: "Σλοβενία", flag: "🇸🇮", asset: "slovenia" },
  { name: "Bulgaria", el: "Βουλγαρία", flag: "🇧🇬", asset: "bulgaria" },
  { name: "Croatia", el: "Κροατία", flag: "🇭🇷", asset: "croatia" },
];

const photo = (key: string) => `/design-reference/${key}.webp`;

export function VisualHome() {
  const { lang, setLang, t } = useCasino();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [travellers, setTravellers] = useState("2");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All Destinations");
  const shown = useMemo(() => destinations, []);
  function search(e: FormEvent) {
    e.preventDefault();
    // This is a concierge ENQUIRY, not a real-time booking or live availability search.
    void navigate({
      to: "/request",
      search: { interest: selected, start: arrival, party: travellers },
    });
  }
  const nav = [
    { en: "Home", el: "Αρχική", href: "/" },
    { en: "Casinos", el: "Καζίνο", href: "/explore" },
    { en: "Destinations", el: "Προορισμοί", href: "/destinations" },
    { en: "Casino Cruises", el: "Κρουαζιέρες", href: "/services" },
    { en: "Travel Concierge", el: "Οργάνωση Ταξιδιού", href: "/services" },
    { en: "Free Concierge", el: "Δωρεάν Concierge", href: "/request" },
    { en: "About Us", el: "Σχετικά", href: "/about" },
    { en: "Contact", el: "Επικοινωνία", href: "/contact" },
  ];
  const categories = [
    {
      id: "All Destinations",
      en: "All Destinations",
      el: "Όλοι οι προορισμοί",
      icon: Globe2,
      href: "/destinations",
    },
    {
      id: "Land Casinos",
      en: "Land Casinos",
      el: "Επίγεια καζίνο",
      icon: Dices,
      href: "/explore",
    },
    {
      id: "Casino Resorts",
      en: "Casino Resorts",
      el: "Casino Resorts",
      icon: Hotel,
      href: "/explore",
    },
    {
      id: "Casino Cruises",
      en: "Casino Cruises",
      el: "Κρουαζιέρες",
      icon: Ship,
      href: "/services",
    },
    {
      id: "Flights",
      en: "Flights",
      el: "Πτήσεις",
      icon: Plane,
      href: "/request",
    },
    {
      id: "Hotels",
      en: "Hotels",
      el: "Ξενοδοχεία",
      icon: Building2,
      href: "/request",
    },
    {
      id: "Transfers",
      en: "Transfers",
      el: "Μεταφορές",
      icon: CarFront,
      href: "/request",
    },
  ];
  return (
    <div className="cb-design">
      <div className="cb-visual-topbar">
        <Link to="/" className="cb-logo" aria-label="CasinoBooking.com">
          <span className="cb-spade">♠</span>
          <span>
            <strong>CasinoBooking.com</strong>
            <small>CASINOS · RESORTS · CRUISES · TRAVEL</small>
          </span>
        </Link>
        <nav
          className={menuOpen ? "cb-nav cb-nav-open" : "cb-nav"}
          aria-label="Main navigation"
        >
          {nav.map((n) => (
            <Link
              key={n.en}
              to={n.href as "/"}
              onClick={() => setMenuOpen(false)}
            >
              {t(n.en, n.el)}
            </Link>
          ))}
        </nav>
        <div className="cb-top-actions">
          <button
            className="cb-language"
            onClick={() => setLang(lang === "el" ? "en" : "el")}
            aria-label={t("Change language", "Αλλαγή γλώσσας")}
          >
            <span>{lang === "el" ? "🇬🇷" : "🇬🇧"}</span> {lang.toUpperCase()}{" "}
            <span aria-hidden="true">⌄</span>
          </button>
          <Link className="cb-login" to="/auth">
            {t("Login", "Σύνδεση")}
          </Link>
          <Link className="cb-register" to="/auth">
            {t("Register", "Εγγραφή")}
          </Link>
          <button
            className="cb-menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <main>
        <section className="cb-hero">
          <div
            className="cb-hero-photo"
            role="img"
            aria-label="Illustrative Monte Carlo luxury casino destination concept"
          />
          <div className="cb-hero-shade" />
          <div className="cb-hero-inner">
            <h1>
              <span>{t("Your Gateway to", "Η Πύλη σας προς")}</span>
              <strong>{t("World-Class Casinos", "Κορυφαία Καζίνο")}</strong>
            </h1>
            <p>
              {t(
                "Discover remarkable casino destinations across Europe.",
                "Ανακαλύψτε μοναδικούς προορισμούς καζίνο στην Ευρώπη.",
              )}
              <br />
              {t(
                "Request hotels, flights and complete travel coordination — all in one place.",
                "Ζητήστε ξενοδοχεία, πτήσεις και πλήρη ταξιδιωτική οργάνωση — όλα σε ένα μέρος.",
              )}
            </p>
            <div className="cb-trust-strip">
              <span>
                <ShieldCheck />
                {t("Curated casino", "Επιλεγμένοι")}
                <br />
                {t("destinations", "προορισμοί")}
              </span>
              <span>
                <Plane />
                {t("Travel itinerary", "Ταξιδιωτικά")}
                <br />
                {t("enquiries", "αιτήματα")}
              </span>
              <span>
                <Hotel />
                {t("Concierge travel", "Ταξιδιωτική")}
                <br />
                {t("coordination", "οργάνωση")}
              </span>
              <span>
                <LockKeyhole />
                {t("Private account", "Προσωπικός")}
                <br />
                {t("area", "λογαριασμός")}
              </span>
            </div>
          </div>
          <div className="cb-hero-caption">
            <MapPin size={13} />
            <span>
              Monte-Carlo, Monaco
              <small>
                {t(
                  "Illustrative design photography",
                  "Ενδεικτική εικόνα σχεδίου",
                )}
              </small>
            </span>
          </div>
        </section>
        <div className="cb-content">
          <form className="cb-search" onSubmit={search}>
            <div className="cb-search-item">
              <MapPin />
              <label>
                {t("Destination", "Προορισμός")}
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">
                    {t("Select country or casino", "Επιλέξτε χώρα ή καζίνο")}
                  </option>
                  {destinations.map((c) => (
                    <option key={c.name} value={c.name}>
                      {lang === "el" ? c.el : c.name}
                    </option>
                  ))}
                  {approvedCountries
                    .filter((c) => c.kind === "international")
                    .map((c) => (
                      <option key={c.slug} value={c.name[0]}>
                        {c.flag} {c.name[lang === "el" ? 1 : 0]}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <div className="cb-search-item">
              <CalendarDays />
              <label>
                {t("Check-in / Check-out", "Άφιξη / Αναχώρηση")}
                <div className="cb-dates">
                  <input
                    aria-label="Check-in"
                    type="date"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                  />
                  <input
                    aria-label="Check-out"
                    min={arrival || undefined}
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div className="cb-search-item">
              <Users />
              <label>
                {t("Travelers", "Ταξιδιώτες")}
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 20].map((n) => (
                    <option value={n} key={n}>
                      {n} {t("Adults", "Ενήλικες")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button type="submit" className="cb-search-submit">
              <Search size={17} />
              {t("Enquire", "Αίτημα")}
            </button>
          </form>
          <div className="cb-categories">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  className={
                    filter === c.id
                      ? "cb-category cb-category-active"
                      : "cb-category"
                  }
                  to={c.href as "/"}
                  onClick={() => setFilter(c.id)}
                  key={c.id}
                >
                  <span>
                    <Icon size={24} />
                  </span>
                  {t(c.en, c.el)}
                </Link>
              );
            })}
          </div>
          <section
            className="cb-countries"
            aria-label="Popular casino destinations"
          >
            <div className="cb-section-heading">
              <div>
                <h2>
                  {t(
                    "Popular Casino Destinations",
                    "Δημοφιλείς Προορισμοί Καζίνο",
                  )}
                </h2>
                <p>
                  {t(
                    "Explore sought-after European destinations with casino entertainment and luxury stays.",
                    "Ανακαλύψτε ευρωπαϊκούς προορισμούς με καζίνο και πολυτελείς επιλογές διαμονής.",
                  )}
                </p>
              </div>
              <Link to="/destinations">
                {t("View All Destinations", "Όλοι οι προορισμοί")}{" "}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="cb-country-grid">
              {shown.map((c) => (
                <article className="cb-country" key={c.name}>
                  <img
                    loading="lazy"
                    src={photo(c.asset)}
                    alt={`${lang === "el" ? c.el : c.name} — approved illustrative visual reference`}
                  />
                  <div className="cb-country-overlay">
                    <strong>
                      <span className="cb-flag">{c.flag}</span>
                      {lang === "el" ? c.el : c.name}
                    </strong>
                    <div>
                      <small>
                        {t("Casino travel enquiries", "Αιτήματα ταξιδιού")}
                      </small>
                      <Link
                        to="/casino-country/$slug"
                        params={{ slug: c.asset }}
                      >
                        {t("Explore", "Εξερεύνηση")} <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="cb-disclosure">
              {t(
                "Destination photos reproduce the approved design reference and may be illustrative. Casino availability and venue operating status must be independently verified. We coordinate travel enquiries; no booking is confirmed on submission. Adults only.",
                "Οι φωτογραφίες προέρχονται από το εγκεκριμένο σχεδιαστικό πρότυπο και ενδέχεται να είναι ενδεικτικές. Η λειτουργία κάθε καζίνο επιβεβαιώνεται ανεξάρτητα. Συντονίζουμε ταξιδιωτικά αιτήματα· η υποβολή δεν αποτελεί επιβεβαιωμένη κράτηση. Μόνο ενήλικες.",
              )}
            </p>
          </section>
          <section
            className="cb-global-extension"
            aria-label="Global premium casino destinations"
          >
            <div className="cb-section-heading">
              <div>
                <h2>
                  {t(
                    "Global Premium Casino Destinations",
                    "Παγκόσμιοι Premium Προορισμοί Καζίνο",
                  )}
                </h2>
                <p>
                  {t(
                    "United States, Russia and an upcoming UAE resort — added below your original European destinations.",
                    "ΗΠΑ, Ρωσία και μελλοντικό resort στα ΗΑΕ — κάτω από τους αρχικούς ευρωπαϊκούς προορισμούς.",
                  )}
                </p>
              </div>
              <Link to="/destinations">
                {t("All 15 Countries", "Και οι 15 χώρες")}{" "}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="cb-global-photo-grid">
              {approvedCountries
                .filter((c) => c.kind !== "europe")
                .map((c) => (
                  <Link
                    key={c.slug}
                    to="/casino-country/$slug"
                    params={{ slug: c.slug }}
                    className="cb-global-photo-card"
                  >
                    <img
                      loading="lazy"
                      src={c.image}
                      alt={t(c.name[0], c.name[1]) + " — destination image"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {c.kind === "planned" && (
                      <b className="cb-global-upcoming">
                        {t(
                          "Coming 2027 · Not Open",
                          "Αναμένεται 2027 · Δεν λειτουργεί",
                        )}
                      </b>
                    )}
                    <span>
                      <strong>
                        {c.flag} {t(c.name[0], c.name[1])}
                      </strong>
                      <small>
                        {c.kind === "planned"
                          ? t(
                              "Upcoming Wynn Al Marjan Island",
                              "Μελλοντικό Wynn Al Marjan Island",
                            )
                          : `${countryVenues(c.slug).length} ${t("selected casino venues", "επιλεγμένα καζίνο")}`}
                      </small>
                    </span>
                  </Link>
                ))}
            </div>
            <p className="cb-disclosure">
              {t(
                "The additional region photographs are credited on each destination page. UAE's Wynn Al Marjan project is planned for 2027, not open. Country and casino sources must be checked before travel; enquiries do not confirm supplier bookings.",
                "Οι πρόσθετες φωτογραφίες έχουν αναφορά πηγής στις σελίδες προορισμών. Το Wynn Al Marjan στα ΗΑΕ αναμένεται το 2027 και δεν λειτουργεί. Ελέγχουμε πηγές και διαθεσιμότητα πριν από κάθε ταξίδι· τα αιτήματα δεν αποτελούν επιβεβαιωμένες κρατήσεις.",
              )}
            </p>
          </section>
        </div>
      </main>
      <footer className="cb-bottom-bar">
        <div>
          <MapPin />
          <span>
            {t("Popular destinations", "Δημοφιλείς προορισμοί")}
            <small>{t("Casino-focused travel", "Ταξίδια με καζίνο")}</small>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            {t("Privacy conscious", "Σεβασμός στο απόρρητο")}
            <small>
              {t("Secure customer accounts", "Ασφαλείς λογαριασμοί")}
            </small>
          </span>
        </div>
        <div>
          <Headset />
          <span>
            {t("Concierge assistance", "Βοήθεια concierge")}
            <small>{t("By enquiry", "Κατόπιν αιτήματος")}</small>
          </span>
        </div>
        <Link className="cb-free-button" to="/request">
          <Crown size={18} />
          <span>
            {t("Request Free Concierge", "Δωρεάν αίτημα concierge")}
            <small>
              {t(
                "Hotels · Flights · Transfers",
                "Ξενοδοχεία · Πτήσεις · Μεταφορές",
              )}
            </small>
          </span>
        </Link>
      </footer>
    </div>
  );
}
