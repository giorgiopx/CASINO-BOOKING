import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, MapPin } from "lucide-react";
import { useCasino } from "@/components/casino/context";
import {
  approvedCountries, approvedTotals, countryVenues
} from "@/lib/approved-casino-directory";
import { casinoHead } from "@/lib/casino-seo";
import "./approved-destinations.css";
export const Route = createFileRoute("/destinations")({
  head: () => casinoHead("15 casino travel countries | CasinoBooking.com",
    "Explore 15 curated countries and 51 selected casino/gaming venues. Free travel concierge enquiries; Wynn Al Marjan is a future 2027 project."),
  component: ApprovedDestinations,
});
function ApprovedDestinations() {
  const { lang, t } = useCasino();
  const [query,setQuery] = useState("");
  const visible = useMemo(() => approvedCountries.filter(c => {
    const words = [c.slug, ...c.name, ...countryVenues(c.slug).flatMap(v => [v.name,...v.locality])].join(" ").toLocaleLowerCase();
    return words.includes(query.trim().toLocaleLowerCase());
  }),[query]);
  const europe = visible.filter(c => c.kind === "europe");
  const international = visible.filter(c => c.kind !== "europe");
  return <main className="cb-approved-destinations">
    <section className="cb-approved-hero">
      <div className="cb-approved-wrap">
        <p className="cb-approved-label">CASINOBOOKING.COM · WORLD DESTINATIONS</p>
        <h1>{t("Discover casino travel destinations","Ανακαλύψτε προορισμούς με καζίνο")}</h1>
        <p>{t(
          "Europe, the United States and Russia — selected venues and free concierge travel enquiries. UAE is listed as a future project only.",
          "Ευρώπη, ΗΠΑ και Ρωσία — επιλεγμένοι χώροι και δωρεάν αιτήματα ταξιδιωτικού συντονισμού. Τα ΗΑΕ εμφανίζονται μόνο ως μελλοντικό έργο.")}</p>
        <div className="cb-approved-counts"><span>{approvedTotals.countries} {t("countries", "χώρες")}</span><span>{approvedTotals.activeCandidates} {t("selected operating candidates", "επιλεγμένοι λειτουργούντες χώροι προς επανέλεγχο")}</span><span>{approvedTotals.planned} {t("future project", "μελλοντικό έργο")}</span></div>
      </div>
    </section>
    <div className="cb-approved-wrap cb-approved-main">
      <label className="cb-approved-filter"><Search size={19}/><input
        value={query} onChange={e=>setQuery(e.target.value)}
        aria-label={t("Search country, city or casino", "Αναζήτηση χώρας, πόλης ή καζίνο")}
        placeholder={t("Search country, city or casino…", "Αναζήτηση χώρας, πόλης ή καζίνο…")} /></label>
      <section className="cb-approved-section">
        <div className="cb-approved-heading">
          <h2>{t("Popular Casino Destinations · Europe","Δημοφιλείς Προορισμοί Καζίνο · Ευρώπη")}</h2>
          <p>{t("The original twelve countries and their approved visual style.", "Οι αρχικές δώδεκα χώρες με την εγκεκριμένη αισθητική.")}</p>
        </div>
        <div className="cb-approved-grid">
          {europe.map(c=><Link key={c.slug}
            to="/casino-country/$slug" params={{slug:c.slug}}
            className="cb-approved-card">
            <img src={c.image} alt={c.name[lang === "el"?1:0]+" — approved editorial concept"} loading="lazy" onError={e=>e.currentTarget.style.display="none"}/>
            <div className="cb-approved-caption"><span>{c.flag} {c.name[lang === "el"?1:0]}</span>
              <small>{countryVenues(c.slug).length} {t("selected venues", "επιλεγμένοι χώροι")}</small>
              <strong>{t("Explore", "Εξερεύνηση")} <ArrowRight size={14}/></strong></div>
          </Link>)}
        </div>
      </section>
      <section className="cb-approved-section">
        <div className="cb-approved-heading">
          <h2>{t("Global Premium Casino Destinations","Παγκόσμιοι Premium Προορισμοί Καζίνο")}</h2>
          <p>{t("United States, Russia, and the upcoming UAE resort project.","Ηνωμένες Πολιτείες, Ρωσία και το μελλοντικό resort των ΗΑΕ.")}</p>
        </div>
        <div className="cb-approved-grid cb-approved-world-grid">
          {international.map(c=><Link key={c.slug} to="/casino-country/$slug" params={{slug:c.slug}} className="cb-approved-card">
            <img src={c.image} alt={c.name[lang==="el"?1:0]+" — destination view"} loading="lazy" onError={e=>e.currentTarget.style.display="none"}/>
            {c.kind==="planned"&&<b className="cb-approved-planned">{t("Coming 2027 · Not Open", "Έρχεται 2027 · Μη λειτουργούν")}</b>}
            <div className="cb-approved-caption"><span>{c.flag} {c.name[lang === "el"?1:0]}</span>
              <small>{c.kind==="planned"?t("Future development only", "Μόνο μελλοντικό έργο"):`${countryVenues(c.slug).length} ${t("selected venues","επιλεγμένοι χώροι")}`}</small>
              <strong>{t("Explore", "Εξερεύνηση")} <ArrowRight size={14}/></strong></div>
          </Link>)}
        </div>
      </section>
      <p className="cb-approved-warning"><MapPin size={18}/>
        {t("Independent directory — not affiliated with casino operators. Images may illustrate destinations rather than named properties. Check operating status, age and travel rules before booking. No live flights, hotel inventory or confirmed bookings.",
          "Ανεξάρτητος κατάλογος χωρίς δηλωμένες συνεργασίες. Οι εικόνες ενδέχεται να απεικονίζουν τον προορισμό και όχι συγκεκριμένο κατάλυμα. Ελέγξτε λειτουργία, ηλικιακούς και ταξιδιωτικούς κανόνες. Δεν υπάρχουν ζωντανές διαθεσιμότητες ή επιβεβαιωμένες κρατήσεις.")}
      </p>
    </div>
  </main>;
}
