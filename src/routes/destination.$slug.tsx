import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { useCasino } from "@/components/casino/context";
import { approvedCountries, countryVenues } from "@/lib/approved-casino-directory";
import { casinoHead } from "@/lib/casino-seo";
import "./destinations-directory.css";

export const Route = createFileRoute("/destination/$slug")({
  head: ({ params }) => {
    const country = approvedCountries.find(c => c.slug === params.slug);
    return casinoHead(country ? `${country.name[0]} casino destinations | CasinoBooking.com` : "Destination not found | CasinoBooking.com",
      "Independently researched casino and resort destinations. Free travel coordination requests; no live inventory or partnerships implied.");
  },
  component: CountryDetail,
});
function CountryDetail() {
  const { slug } = Route.useParams();
  const { lang, t } = useCasino();
  const country = approvedCountries.find(c => c.slug === slug);
  if (!country) return <main className="approved-directory"><div className="approved-container approved-main"><h1>{t("Destination not found","Ο προορισμός δεν βρέθηκε")}</h1><Link to="/destinations">{t("Back to destinations","Πίσω στους προορισμούς")}</Link></div></main>;
  const venues = countryVenues(slug);
  const future = country.kind === "planned";
  const restricted = slug === "russia";
  return <main className="approved-directory">
    <header className="approved-hero">
      <div className="approved-container">
        <p className="approved-eyebrow">CASINOBOOKING.COM · {t("DESTINATION GUIDE", "ΟΔΗΓΟΣ ΠΡΟΟΡΙΣΜΟΥ")}</p>
        <h1>{country.flag} {country.name[lang === "el" ? 1 : 0]}</h1>
        <p>{future
          ? t("Future project only. Wynn Al Marjan Island is planned for 2027 and is not operating yet.","Μόνο μελλοντικό έργο. Το Wynn Al Marjan Island προβλέπεται για το 2027 και δεν λειτουργεί ακόμη.")
          : restricted
            ? t("Casino information only. Travel coordination is not offered until sanctions and travel-law checks are completed.","Μόνο πληροφορίες καζίνο. Δεν προσφέρουμε συντονισμό ταξιδιού πριν ολοκληρωθεί ο έλεγχος κυρώσεων και ταξιδιωτικής νομοθεσίας.")
            : t("Explore selected operator-listed casino venues and ask us to coordinate your travel. No live booking or partnership is implied.","Δείτε επιλεγμένα καζίνο με επίσημες πηγές και ζητήστε συντονισμό ταξιδιού. Δεν υπονοείται πραγματική κράτηση ή συνεργασία.")}</p>
        <Link to="/destinations" className="approved-back"><ArrowLeft size={17}/>{t("All destinations","Όλοι οι προορισμοί")}</Link>
      </div>
    </header>
    <section className="approved-container approved-main">
      <div className="approved-detail-image">
        <img src={country.image} loading="lazy" alt={t(country.name[0],country.name[1])+" — editorial destination illustration"} onError={e=>{e.currentTarget.hidden=true}}/>
      </div>
      <p className="approved-caution">{t("Editorial travel listing: verify opening times, operating license, minimum gaming age and visa requirements before travel. CasinoBooking does not sell gambling services.","Ενημερωτικός κατάλογος: ελέγξτε λειτουργία, άδεια, νόμιμη ηλικία και απαιτήσεις visa πριν από το ταξίδι. Το CasinoBooking δεν διαθέτει υπηρεσίες τυχερών παιχνιδιών.")}</p>
      <h2 className="approved-detail-title">{t("Selected casinos and gaming venues","Επιλεγμένα καζίνο και χώροι gaming")} ({venues.length})</h2>
      <ul className="approved-venues approved-detail-venues">
        {venues.map(v=><li key={v.id}>
          <div>
            <h3>{v.name}</h3>
            <p><MapPin size={14} style={{display:"inline"}}/> {v.locality[lang === "el" ? 1 : 0]}</p>
            <span className={v.status==="planned"?"approved-planned":"approved-listed"}>{v.status==="planned"?t("Planned · not open","Μελλοντικό · δεν λειτουργεί"):t("Operator listed — recheck before travel","Καταχώριση διαχειριστή — επανέλεγχος πριν το ταξίδι")}</span>
          </div>
          <div className="approved-actions">
            <a href={v.officialUrl} rel="noopener noreferrer" target="_blank">{t("Official website","Επίσημη ιστοσελίδα")} <ExternalLink size={14}/></a>
            {!future && !restricted && <Link to="/request" search={{interest:v.name}}>{t("Free travel enquiry","Δωρεάν ταξιδιωτικό αίτημα")} <ArrowRight size={15}/></Link>}
          </div>
        </li>)}
      </ul>
      {country.imageCredit && country.imageCreditUrl && <p className="approved-source">{t("Editorial image:","Εικόνα προορισμού:")} <a href={country.imageCreditUrl} target="_blank" rel="noopener noreferrer">{country.imageCredit}</a></p>}
      <Link to="/destinations" className="approved-back"><ArrowLeft size={17}/>{t("View all 15 countries","Δείτε και τις 15 χώρες")}</Link>
    </section>
  </main>;
}
