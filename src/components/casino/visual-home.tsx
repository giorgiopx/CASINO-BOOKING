/**
 * CasinoBooking approved visual homepage.
 * Visual components re-create the user-provided reference using cropped elements
 * of the SAME original approved concept; no replacement destination photography.
 * The cards are editorial previews, NOT a verified inventory or partnership claim.
 * Assets required: public/design-reference/*.webp supplied in handoff ZIP.
 */
import { useState, type FormEvent } from "react";
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
  ArrowRight,
  Globe2,
  Hotel,
  Dices,
  LockKeyhole,
} from "lucide-react";
import { globalDestinations } from "@/lib/global-casino-catalog";
import { approvedCountries } from "@/lib/approved-casino-directory";
import "./visual-home.css";
import { VisualMore } from "./visual-more";
import { SiteHeader } from "./shell";
import { localToday } from "@/lib/casino-request-schema";

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
  const { lang, t } = useCasino();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [travellers, setTravellers] = useState("2");
  const today = localToday();
  const shown = destinations;
  function search(e: FormEvent) {
    e.preventDefault();
    // This is a concierge ENQUIRY, not a real-time booking or live availability search.
    void navigate({
      to: "/request",
      search: {
        interest: selected,
        start: arrival,
        end: departure,
        party: travellers,
        type: "bundle",
      },
    });
  }
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
      el: "Θέρετρα καζίνο",
      icon: Hotel,
      href: "/explore",
    },
    {
      id: "Casino Cruises",
      en: "Casino Cruises",
      el: "Κρουαζιέρες",
      icon: Ship,
      href: "/request",
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
  ] as const;
  return (
    <div className="cb-design">
      <SiteHeader />
      <main>
        <section className="cb-hero">
          <div
            className="cb-hero-photo"
            role="img"
            aria-label={t(
              "Illustrative Monte Carlo luxury casino destination",
              "Ενδεικτική εικόνα πολυτελούς προορισμού καζίνο στο Μόντε Κάρλο",
            )}
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
              {t("Monte-Carlo, Monaco", "Μόντε Κάρλο, Μονακό")}
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
                </select>
              </label>
            </div>
            <div className="cb-search-item">
              <CalendarDays />
              <div className="cb-date-field">
                <span>{t("Check-in / Check-out", "Άφιξη / Αναχώρηση")}</span>
                <div className="cb-dates">
                  <input
                    aria-label={t("Arrival date", "Ημερομηνία άφιξης")}
                    min={today}
                    type="date"
                    value={arrival}
                    onChange={(e) => {
                      setArrival(e.target.value);
                      if (departure && departure < e.target.value)
                        setDeparture("");
                    }}
                  />
                  <input
                    aria-label={t("Departure date", "Ημερομηνία αναχώρησης")}
                    min={arrival || today}
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                  />
                </div>
              </div>
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
                    c.id === "All Destinations"
                      ? "cb-category cb-category-active"
                      : "cb-category"
                  }
                  to={c.href}
                  search={
                    c.id === "Flights"
                      ? { type: "flight" }
                      : c.id === "Hotels"
                        ? { type: "hotel" }
                        : c.id === "Transfers"
                          ? { type: "transfer" }
                          : c.id === "Casino Cruises"
                            ? { type: "cruise" }
                            : {}
                  }
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
            aria-label={t(
              "Popular casino destinations",
              "Δημοφιλείς προορισμοί καζίνο",
            )}
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
                    alt={`${t(c.name, c.el)} — ${t("illustrative destination photograph", "ενδεικτική φωτογραφία προορισμού")}`}
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
                        to="/destination/$slug"
                        params={{ slug: c.asset }}
                        aria-label={t(
                          `Explore ${c.name}`,
                          `Εξερευνήστε: ${c.el}`,
                        )}
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
            aria-label={t(
              "International casino destinations",
              "Διεθνείς προορισμοί καζίνο",
            )}
          >
            <div className="cb-section-heading">
              <div>
                <h2>
                  {t(
                    "Global Premium Casino Destinations",
                    "Διεθνείς Premium Προορισμοί Καζίνο",
                  )}
                </h2>
                <p>
                  {t(
                    "Discover the United States, Russia and future resort development in the UAE. View casino information and official sources.",
                    "Ανακαλύψτε ΗΠΑ, Ρωσία και το μελλοντικό resort στα ΗΑΕ με επίσημες πηγές.",
                  )}
                </p>
              </div>
              <Link to="/destinations">
                {t("All 15 countries", "Και οι 15 χώρες")}{" "}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="cb-global-photo-grid">
              {approvedCountries
                .filter((c) => c.kind !== "europe")
                .map((c) => (
                  <Link
                    to="/destination/$slug"
                    params={{ slug: c.slug }}
                    className="cb-global-photo-card"
                    key={c.slug}
                  >
                    <div className="cb-region-art" aria-hidden="true">
                      <Globe2 />
                      <span>{t("DESTINATION GUIDE", "ΟΔΗΓΟΣ ΠΡΟΟΡΙΣΜΟΥ")}</span>
                    </div>
                    <span>
                      <strong>
                        {c.flag} {t(c.name[0], c.name[1])}
                      </strong>
                      <small>
                        {c.kind === "planned"
                          ? t(
                              "Future resort · not operating yet",
                              "Μελλοντικό resort · δεν λειτουργεί",
                            )
                          : t("Explore casino venues", "Εξερευνήστε τα καζίνο")}
                      </small>
                    </span>
                  </Link>
                ))}
            </div>
            <p className="cb-disclosure">
              {t(
                "Russia is information-only pending sanctions and travel-compliance review. Wynn Al Marjan Island is planned for 2027, not open. Consult official sources for current venue details.",
                "Η Ρωσία εμφανίζεται μόνο ενημερωτικά μέχρι τον έλεγχο ταξιδιωτικών περιορισμών και κυρώσεων. Το Wynn Al Marjan Island προβλέπεται για το 2027, δεν λειτουργεί ακόμη. Συμβουλευτείτε τις επίσημες πηγές για τις τρέχουσες πληροφορίες.",
              )}
            </p>
          </section>
          <section
            className="cb-global-extension"
            aria-label={t(
              "American casino destinations",
              "Αμερικανικοί προορισμοί καζίνο",
            )}
          >
            <div className="cb-section-heading">
              <div>
                <h2>
                  {t(
                    "American Casino Destinations",
                    "Προορισμοί Καζίνο στην Αμερική",
                  )}
                </h2>
                <p>
                  {t(
                    "Discover United States casino destinations and consult the official operator sources.",
                    "Ανακαλύψτε προορισμούς καζίνο στις ΗΠΑ και συμβουλευτείτε τις επίσημες πηγές των διαχειριστών.",
                  )}
                </p>
              </div>
              <a href="/global-casinos">
                {t(
                  "Explore United States & UAE status",
                  "ΗΠΑ και πληροφορίες για ΗΑΕ",
                )}{" "}
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="cb-global-photo-grid">
              {globalDestinations
                .filter((d) => d.country === "US" && d.photoFile)
                .slice(0, 4)
                .map((d) => (
                  <a
                    href={"/global-casinos"}
                    className="cb-global-photo-card"
                    key={d.slug}
                  >
                    <div className="cb-region-art" aria-hidden="true">
                      <Building2 />
                      <span>{t("UNITED STATES", "ΗΝΩΜΕΝΕΣ ΠΟΛΙΤΕΙΕΣ")}</span>
                    </div>
                    <span>
                      <strong>{t(d.name[0], d.name[1])}</strong>
                      <small>
                        {t(
                          "View casino information",
                          "Δείτε πληροφορίες καζίνο",
                        )}
                      </small>
                    </span>
                  </a>
                ))}
            </div>
            <p className="cb-disclosure">
              {t(
                "Explore regional guides with official operator sources. No casino partnerships or live flight/hotel inventory are implied.",
                "Εξερευνήστε τους οδηγούς περιοχών με επίσημες πηγές διαχειριστών. Δεν υπονοούνται συνεργασίες ή πραγματική διαθεσιμότητα πτήσεων και ξενοδοχείων.",
              )}
            </p>
          </section>
        </div>
      </main>
      <VisualMore />
    </div>
  );
}
