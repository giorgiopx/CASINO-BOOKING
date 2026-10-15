import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useCasino } from "@/components/casino/context";
import {
  approvedCountries,
  countryVenues,
  findApprovedCountry,
  type ApprovedCasino,
} from "@/lib/approved-casino-directory";
import { casinoHead } from "@/lib/casino-seo";
import "./casino-country.css";

export const Route = createFileRoute("/casino-country/$slug")({
  head: () =>
    casinoHead(
      "Casino destinations and travel enquiries | CasinoBooking.com",
      "Explore selected casino venues and request free travel concierge coordination. No casino partnerships or live booking inventory are claimed.",
    ),
  component: CountryPage,
});

function VenueCard({ venue }: { venue: ApprovedCasino }) {
  const { lang, t } = useCasino();
  const future = venue.status === "planned";
  return (
    <article className="cb-country-venue">
      <div className="cb-country-venue-icon" aria-hidden="true">
        ♠
      </div>
      <div className="cb-country-venue-info">
        <div className="cb-country-venue-caption">
          <MapPin size={13} />
          <span>{lang === "el" ? venue.locality[1] : venue.locality[0]}</span>
        </div>
        <h3>{venue.name}</h3>
        <p className="cb-country-venue-note">
          {future
            ? t(
                "Announced development · not open for casino visits",
                "Ανακοινωμένο έργο · δεν λειτουργεί ακόμη",
              )
            : venue.gaming === "electronic-gaming"
              ? t(
                  "Electronic gaming venue; facilities differ from a traditional casino",
                  "Χώρος ηλεκτρονικών παιχνιδιών· οι υπηρεσίες διαφέρουν από ένα κλασικό καζίνο",
                )
              : t(
                  "Operator-listed venue · confirm services and entry rules before travel",
                  "Χώρος καταχωρισμένος από τον φορέα · επιβεβαιώστε παροχές και κανόνες εισόδου πριν το ταξίδι",
                )}
        </p>
        <div className="cb-country-venue-footer">
          <a
            href={venue.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cb-country-source"
          >
            {t("Official operator source", "Επίσημη πηγή φορέα")}{" "}
            <ExternalLink size={13} />
          </a>
          {future ? (
            <span className="cb-country-upcoming">
              {t("Future project · 2027", "Μελλοντικό έργο · 2027")}
            </span>
          ) : (
            <Link
              to="/request"
              search={{ interest: venue.name }}
              className="cb-country-enquire"
            >
              {t("Plan a trip", "Οργάνωση ταξιδιού")} <ArrowRight size={14} />
            </Link>
          )}
        </div>
        <small className="cb-country-source-date">
          {t("Source checked", "Έλεγχος πηγής")}: {venue.sourceChecked}
        </small>
      </div>
    </article>
  );
}

function CountryPage() {
  const { slug } = Route.useParams();
  const { lang, t } = useCasino();
  const country = findApprovedCountry(slug);
  const [query, setQuery] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const venues = useMemo(
    () =>
      countryVenues(slug).filter((v) =>
        [v.name, ...v.locality]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
      ),
    [slug, query],
  );
  if (!country)
    return (
      <main className="cb-country-page cb-country-missing">
        <h1>{t("Destination not found", "Δεν βρέθηκε προορισμός")}</h1>
        <Link to="/destinations">
          <ArrowLeft size={14} />
          {t("All destinations", "Όλοι οι προορισμοί")}
        </Link>
      </main>
    );
  const displayName = country.name[lang === "el" ? 1 : 0];
  return (
    <main className="cb-country-page">
      <section className="cb-country-hero">
        {!imageFailed && (
          <img
            src={country.image}
            alt={displayName + " – editorial destination view"}
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="cb-country-hero-shade" />
        <div className="cb-country-inner">
          <Link to="/destinations" className="cb-country-back">
            <ArrowLeft size={16} />
            {t("Destinations", "Προορισμοί")}
          </Link>
          <span className="cb-country-eyebrow">
            {country.flag} · CASINOBOOKING.COM ·{" "}
            {t("CONCIERGE TRAVEL", "ΤΑΞΙΔΙΩΤΙΚΟΣ ΣΥΝΤΟΝΙΣΜΟΣ")}
          </span>
          <h1>{displayName}</h1>
          <p>
            {country.kind === "planned"
              ? t(
                  "Future destination. Wynn Al Marjan Island is expected in 2027; no operating casino is currently advertised here.",
                  "Μελλοντικός προορισμός. Το Wynn Al Marjan Island αναμένεται το 2027· δεν προβάλλεται λειτουργούν καζίνο εδώ.",
                )
              : t(
                  "Discover selected casino destinations and request assistance with flights, hotels, transfers or an entire itinerary.",
                  "Ανακαλύψτε επιλεγμένα καζίνο και ζητήστε βοήθεια για πτήσεις, ξενοδοχεία, μεταφορές ή ολόκληρο ταξιδιωτικό πρόγραμμα.",
                )}
          </p>
        </div>
      </section>
      <div className="cb-country-inner cb-country-content">
        <div className="cb-country-heading">
          <div>
            <p className="cb-country-eyebrow">
              {t("CURATED DESTINATION DIRECTORY", "ΕΠΙΛΕΓΜΕΝΟΣ ΚΑΤΑΛΟΓΟΣ")}
            </p>
            <h2>
              {t(
                "Explore casinos and resorts",
                "Ανακαλύψτε καζίνο και resorts",
              )}
            </h2>
            <p>
              {t(
                "Selected listings, not paid partnerships or live booking inventory.",
                "Επιλεγμένες καταχωρίσεις, όχι συμβεβλημένοι συνεργάτες ή ζωντανή διαθεσιμότητα κρατήσεων.",
              )}
            </p>
          </div>
          <div className="cb-country-count">
            {venues.length} {t("selected venues", "επιλεγμένοι χώροι")}
          </div>
        </div>
        {country.kind === "planned" ? (
          <div className="cb-country-warning">
            {t(
              "The UAE listing is for future awareness only. No current operating casino or travel-to-casino request is represented.",
              "Η καταχώριση των ΗΑΕ είναι μόνο ενημερωτική. Δεν αποτελεί λειτουργούν καζίνο ούτε αίτημα ταξιδιού σε ενεργό καζίνο.",
            )}
          </div>
        ) : (
          <label className="cb-country-filter">
            <Search size={19} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                "Search casino or city...",
                "Αναζητήστε καζίνο ή πόλη...",
              )}
              aria-label={t(
                "Search casinos and cities",
                "Αναζήτηση καζίνο και πόλεων",
              )}
            />
          </label>
        )}
        <div className="cb-country-list">
          {venues.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
        {venues.length === 0 && (
          <p className="cb-country-empty">
            {t("No results", "Δεν βρέθηκαν αποτελέσματα")}
          </p>
        )}
        <div className="cb-country-disclaimer">
          <ShieldCheck size={18} />
          <p>
            {t(
              "Travel-enquiry service only. No confirmed flights, hotels, casino entry or operator partnerships. Verify minimum age, legal eligibility, travel rules and availability before booking. Russia-related requests require a separate legal/sanctions assessment.",
              "Υπηρεσία ταξιδιωτικών αιτημάτων μόνο. Δεν επιβεβαιώνονται πτήσεις, ξενοδοχεία, είσοδος σε καζίνο ή συνεργασίες. Ελέγξτε ηλικία, νομιμότητα, ταξιδιωτικούς κανόνες και διαθεσιμότητα. Αιτήματα για τη Ρωσία απαιτούν ιδιαίτερο νομικό έλεγχο και έλεγχο κυρώσεων.",
            )}
          </p>
        </div>
        {country.imageCreditUrl && (
          <p className="cb-country-photo-credit">
            <a
              href={country.imageCreditUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Destination photo credit", "Πηγή φωτογραφίας προορισμού")}:{" "}
              {country.imageCredit}
            </a>
          </p>
        )}
        <div className="cb-country-links">
          <Link to="/destinations">
            {t("All destinations", "Όλοι οι προορισμοί")}{" "}
            <ArrowRight size={15} />
          </Link>
          {country.kind !== "planned" && (
            <Link to="/request">
              {t(
                "Request free travel coordination",
                "Ζητήστε δωρεάν οργάνωση ταξιδιού",
              )}{" "}
              <ArrowRight size={15} />
            </Link>
          )}
          {country.kind === "international" && slug === "usa" && (
            <Link to="/global-casinos">
              {t("US cities and hotels", "Πόλεις και ξενοδοχεία ΗΠΑ")}{" "}
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
