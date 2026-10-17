import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  Plane,
  Car,
  Users,
  Handshake,
  Building2,
  Check,
  Compass,
  Lock,
  Smartphone,
  Ship,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { casinos, countries, type Pair } from "@/lib/casino-data";
import { useCasino } from "./context";
import { Disclaimer } from "./shell";
import hero from "@/assets/hero.jpg.asset.json";
import greece from "@/assets/greece.jpg.asset.json";
import slovenia from "@/assets/slovenia.jpg.asset.json";
import cyprus from "@/assets/cyprus.jpg.asset.json";
const destinations = [
  {
    country: 1,
    image: cyprus.url,
    caption: ["Mediterranean escapes", "Μεσογειακές αποδράσεις"] as Pair,
  },
  {
    country: 3,
    image: greece.url,
    caption: ["Coastlines & culture", "Ακτές και πολιτισμός"] as Pair,
  },
  {
    country: 2,
    image: slovenia.url,
    caption: ["Nature meets discovery", "Φύση και ανακαλύψεις"] as Pair,
  },
  {
    country: 4,
    image: hero.url,
    caption: ["A new perspective", "Μια νέα οπτική"] as Pair,
  },
];
export function Intro({ title, subtitle }: { title: Pair; subtitle: Pair }) {
  const { p } = useCasino();
  return (
    <section className="page-intro">
      <div className="container-site">
        <div className="eyebrow">CasinoBooking.com</div>
        <h1 className="page-title">{p(title)}</h1>
        <p>{p(subtitle)}</p>
      </div>
    </section>
  );
}
export function DestinationCards() {
  const { p, t } = useCasino();
  return (
    <div className="destination-grid">
      {destinations.map((d) => (
        <Link
          to="/explore"
          search={{ country: String(d.country) }}
          className="destination-card"
          key={d.country}
        >
          <img
            src={d.image}
            alt={
              d.country === 4
                ? t(
                    "Illustrative resort photograph, not a Bulgarian property",
                    "Ενδεικτική φωτογραφία θερέτρου, όχι βουλγαρικό κατάλυμα",
                  )
                : p(countries[d.country])
            }
            loading="lazy"
          />
          <div className="destination-card-content">
            <h3>{p(countries[d.country])}</h3>
            <p>{p(d.caption)}</p>
            {d.country === 4 && (
              <p>
                {t("Illustrative resort image", "Ενδεικτική εικόνα θερέτρου")}
              </p>
            )}
            <ArrowUpRight size={18} className="destination-arrow" />
          </div>
        </Link>
      ))}
    </div>
  );
}
export function ResortCard({ casino }: { casino: (typeof casinos)[number] }) {
  const { t, p } = useCasino();
  return (
    <article className="resort-card">
      <div className="resort-placeholder">
        <Building2 />
        <span>
          {t(
            "PROPERTY IMAGE PENDING APPROVAL",
            "ΕΙΚΟΝΑ ΚΑΤΑΛΥΜΑΤΟΣ ΥΠΟ ΕΓΚΡΙΣΗ",
          )}
        </span>
      </div>
      <div className="resort-body">
        <div className="resort-location">
          <MapPin size={11} />
          {p(casino.city)} · {p(countries[casino.country])}
        </div>
        <h3>{casino.name}</h3>
        <p>{p(casino.summary)}</p>
        <div className="tags">
          {casino.tags.map((tag) => (
            <span className="tag" key={tag[0]}>
              {p(tag)}
            </span>
          ))}
        </div>
        <div className="candidate-note">
          {t(
            "Partner status: Not yet confirmed",
            "Συνεργασία: Δεν έχει επιβεβαιωθεί",
          )}
          <br />
          {t(
            "Verify local legal status before travel",
            "Ελέγξτε το τοπικό νομικό καθεστώς πριν ταξιδέψετε",
          )}
        </div>
        <div className="card-bottom">
          <a
            href={casino.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            {t("Official website", "Επίσημος ιστότοπος")}
            <ArrowUpRight />
          </a>
          <Button variant="secondary" size="sm" asChild>
            <Link to="/request" search={{ interest: casino.name }}>
              {t("Request interest", "Εκδήλωση ενδιαφέροντος")}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
export function ServicesGrid() {
  const { t } = useCasino();
  const services = [
    {
      icon: Handshake,
      title: ["Casino travel", "Ταξίδια σε καζίνο"],
      text: [
        "Plan a destination visit with assistance on local entry requirements. Admission and supplier arrangements need separate confirmation.",
        "Οργανώστε επίσκεψη σε προορισμό με ενημέρωση για τους τοπικούς όρους εισόδου. Η είσοδος και οι διευθετήσεις παρόχων επιβεβαιώνονται χωριστά.",
      ],
      type: "casino",
    },
    {
      icon: Plane,
      title: ["Flights", "Πτήσεις"],
      text: [
        "Share your departure airport, destination and preferred dates for flight assistance. No live fares or ticket issuance.",
        "Δηλώστε αεροδρόμιο αναχώρησης, προορισμό και ημερομηνίες για βοήθεια με πτήσεις. Δεν παρέχονται ζωντανές τιμές ή έκδοση εισιτηρίων.",
      ],
      type: "flight",
    },
    {
      icon: Building2,
      title: ["Hotels", "Ξενοδοχεία"],
      text: [
        "Tell us your preferred location, room needs and budget for a stay coordinated around your journey.",
        "Πείτε μας την περιοχή, τις ανάγκες δωματίων και τον προϋπολογισμό σας για διαμονή προσαρμοσμένη στο ταξίδι.",
      ],
      type: "hotel",
    },
    {
      icon: Car,
      title: ["Transfers", "Μεταφορές"],
      text: [
        "Request airport, port or local transfers with your arrival times, group size and accessibility preferences.",
        "Ζητήστε μεταφορές αεροδρομίου, λιμανιού ή τοπικές διαδρομές με ώρες άφιξης, μέγεθος ομάδας και ανάγκες προσβασιμότητας.",
      ],
      type: "transfer",
    },
    {
      icon: Ship,
      title: ["Cruises", "Κρουαζιέρες"],
      text: [
        "Explore routes, ports and travel dates. Cruise availability and onboard casino access depend on each operator and itinerary.",
        "Εξερευνήστε διαδρομές, λιμάνια και ημερομηνίες. Η διαθεσιμότητα και η πρόσβαση σε καζίνο πλοίου εξαρτώνται από τον πάροχο και το δρομολόγιο.",
      ],
      type: "cruise",
    },
    {
      icon: Users,
      title: ["Complete itineraries", "Ολοκληρωμένα ταξίδια"],
      text: [
        "Combine services in one free enquiry for individual, group or company travel, with your dates and preferences.",
        "Συνδυάστε υπηρεσίες σε ένα δωρεάν αίτημα για ατομικά, ομαδικά ή εταιρικά ταξίδια, με ημερομηνίες και προτιμήσεις.",
      ],
      type: "bundle",
    },
  ];
  return (
    <div className="service-grid cb-services-grid">
      {services.map((s) => (
        <article
          className="service-item"
          id={s.type === "cruise" ? "cruises" : undefined}
          key={s.type}
        >
          <s.icon />
          <h3>{t(s.title[0], s.title[1])}</h3>
          <p>{t(s.text[0], s.text[1])}</p>
          <Link
            to="/request"
            search={{ type: s.type }}
            className="text-link text-gold"
          >
            {t("Make an enquiry", "Στείλτε αίτημα")}
            <ArrowRight />
          </Link>
        </article>
      ))}
    </div>
  );
}
export function FAQ() {
  const { t } = useCasino();
  const faq: { q: Pair; a: Pair }[] = [
    {
      q: [
        "Can I book directly through CasinoBooking.com?",
        "Μπορώ να κάνω κράτηση μέσω CasinoBooking.com;",
      ],
      a: [
        "No. We coordinate free travel enquiries. Any supplier arrangement requires separate confirmation; the website does not provide live availability or issue tickets.",
        "Όχι. Συντονίζουμε δωρεάν ταξιδιωτικά αιτήματα. Κάθε διευθέτηση με πάροχο επιβεβαιώνεται χωριστά· ο ιστότοπος δεν παρέχει ζωντανή διαθεσιμότητα ή έκδοση εισιτηρίων.",
      ],
    },
    {
      q: [
        "Are the listed resorts confirmed partners?",
        "Είναι τα θέρετρα επιβεβαιωμένοι συνεργάτες;",
      ],
      a: [
        "No. These are initial directory candidates. Partnership, commission arrangements and local legal status must be confirmed separately.",
        "Όχι. Είναι αρχικοί υποψήφιοι καταλόγου. Συνεργασίες, προμήθειες και τοπικό νομικό καθεστώς πρέπει να επιβεβαιωθούν χωριστά.",
      ],
    },
    {
      q: [
        "What happens after I send a request?",
        "Τι συμβαίνει μετά την αποστολή αιτήματος;",
      ],
      a: [
        "After a successful submission, your enquiry is saved to your account with a unique reference. Follow its status in your dashboard. Email and WhatsApp notifications are not yet connected; submission does not confirm a booking.",
        "Μετά από επιτυχή υποβολή, το αίτημα αποθηκεύεται στον λογαριασμό σας με μοναδικό κωδικό. Παρακολουθήστε την κατάστασή του στον πίνακά σας. Οι ειδοποιήσεις email και WhatsApp δεν έχουν συνδεθεί· η υποβολή δεν επιβεβαιώνει κράτηση.",
      ],
    },
    {
      q: [
        "Who can use these services?",
        "Ποιος μπορεί να χρησιμοποιήσει τις υπηρεσίες;",
      ],
      a: [
        "Adults only, subject to the higher local age minimum, residency rules and local law. Gambling involves risk; travel should never depend on winnings.",
        "Μόνο ενήλικες, βάσει του υψηλότερου τοπικού ορίου ηλικίας, κατοικίας και νόμου. Ο τζόγος ενέχει κίνδυνο· τα ταξίδια δεν πρέπει να εξαρτώνται από κέρδη.",
      ],
    },
  ];
  return (
    <div>
      {faq.map((f) => (
        <details key={f.q[0]}>
          <summary>{t(...f.q)}</summary>
          <p>{t(...f.a)}</p>
        </details>
      ))}
    </div>
  );
}
export function Home() {
  const navigate = useNavigate();
  const { t } = useCasino();
  const [country, setCountry] = useState("0");
  const [date, setDate] = useState("");
  const [party, setParty] = useState("2");
  return (
    <main>
      <section className="hero">
        <img
          className="hero-image"
          src={hero.url}
          alt={t(
            "Illuminated resort swimming pool at dusk — illustrative travel photography",
            "Φωτισμένη πισίνα θερέτρου το σούρουπο — ενδεικτική ταξιδιωτική φωτογραφία",
          )}
        />
        <div className="container-site hero-content">
          <div className="eyebrow">
            {t(
              "EXCEPTIONAL DESTINATIONS. PERSONAL SERVICE.",
              "ΞΕΧΩΡΙΣΤΟΙ ΠΡΟΟΡΙΣΜΟΙ. ΠΡΟΣΩΠΙΚΗ ΦΡΟΝΤΙΔΑ.",
            )}
          </div>
          <h1>
            {t("Casino resort travel,", "Ταξίδια σε θέρετρα καζίνο,")}
            <br />
            <em>
              {t("beautifully considered.", "με προσοχή στη λεπτομέρεια.")}
            </em>
          </h1>
          <p className="hero-description">
            {t(
              "Discover remarkable resorts and destinations. Let us bring your journey together with thoughtful, personal travel coordination.",
              "Ανακαλύψτε ξεχωριστά θέρετρα και προορισμούς. Σχεδιάστε το ταξίδι σας με προσεκτικό, προσωπικό ταξιδιωτικό συντονισμό.",
            )}
          </p>
          <div className="hero-actions">
            <Button asChild size="lg">
              <Link to="/explore">
                {t("Explore destinations", "Ανακαλύψτε προορισμούς")}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <Link to="/request">
                {t("Plan my journey", "Σχεδιάστε το ταξίδι μου")}
              </Link>
            </Button>
          </div>
          <div className="hero-note">
            <ShieldCheck size={13} />
            {t(
              "Independent coordination · Adults only · Responsible travel",
              "Ανεξάρτητος συντονισμός · Μόνο ενήλικες · Υπεύθυνα ταξίδια",
            )}
          </div>
        </div>
        <div className="hero-location">
          <MapPin size={12} />
          {t(
            "The art of getting away · Illustrative resort image",
            "Η τέχνη της απόδρασης · Ενδεικτική εικόνα θερέτρου",
          )}
        </div>
      </section>
      <div className="container-site">
        <form
          className="search-strip"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({
              to: "/request",
              search: { country, start: date, party },
            });
          }}
        >
          <div className="search-field">
            <label>
              {t("YOUR DESTINATION", "ΠΡΟΟΡΙΣΜΟΣ")}
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countries.map((c, i) => (
                  <option value={i} key={i}>
                    {t(...c)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="search-field">
            <label>
              {t("TRAVEL DATES", "ΗΜΕΡΟΜΗΝΙΑ ΤΑΞΙΔΙΟΥ")}
              <input
                type="date"
                aria-label={t("Travel date", "Ημερομηνία ταξιδιού")}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              {t("TRAVELLERS", "ΤΑΞΙΔΙΩΤΕΣ")}
              <select value={party} onChange={(e) => setParty(e.target.value)}>
                {["1", "2", "3", "4", "5", "6", "8", "10"].map((n) => (
                  <option key={n} value={n}>
                    {n} {t("adults", "ενήλικες")}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button type="submit" size="lg">
            {t("Design my trip", "Σχεδιάστε το ταξίδι")}
            <ArrowRight />
          </Button>
        </form>
        <div className="trust-line">
          <span>
            <Compass />
            {t("Curated destination discovery", "Επιλεγμένοι προορισμοί")}
          </span>
          <span>
            <Handshake />
            {t("Personal travel coordination", "Προσωπικός συντονισμός")}
          </span>
          <span>
            <Lock />
            {t(
              "Privacy-conscious by design",
              "Σχεδιασμένο με σεβασμό στο απόρρητο",
            )}
          </span>
          <span>
            <GlobeIcon />
            {t("Greek & English support", "Ελληνικά & Αγγλικά")}
          </span>
        </div>
      </div>
      <section className="section">
        <div className="container-site">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                {t("A WORLD WORTH DISCOVERING", "ΕΝΑΣ ΚΟΣΜΟΣ ΓΙΑ ΑΝΑΚΑΛΥΨΗ")}
              </div>
              <h2>
                {t(
                  "Where will your journey take you?",
                  "Πού θα σας οδηγήσει το ταξίδι σας;",
                )}
              </h2>
              <p className="section-subtitle">
                {t(
                  "Mediterranean coastlines, memorable stays, and somewhere a little unexpected.",
                  "Μεσογειακές ακτές, αξέχαστες διαμονές και κάτι λίγο απρόσμενο.",
                )}
              </p>
            </div>
            <Link to="/destinations" className="text-link">
              {t("All destinations", "Όλοι οι προορισμοί")}
              <ArrowRight />
            </Link>
          </div>
          <DestinationCards />
        </div>
      </section>
      <section className="section pt-0">
        <div className="container-site">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                {t("THE INITIAL COLLECTION", "Η ΑΡΧΙΚΗ ΣΥΛΛΟΓΗ")}
              </div>
              <h2>
                {t(
                  "Resorts to inspire your next escape",
                  "Θέρετρα για την επόμενη απόδραση",
                )}
              </h2>
              <p className="section-subtitle">
                {t(
                  "Initial directory candidates. Independent discovery, not confirmed partnerships.",
                  "Αρχικοί υποψήφιοι καταλόγου. Ανεξάρτητη ανακάλυψη, όχι επιβεβαιωμένες συνεργασίες.",
                )}
              </p>
            </div>
            <Link to="/explore" className="text-link">
              {t("Explore the directory", "Δείτε τον κατάλογο")}
              <ArrowRight />
            </Link>
          </div>
          <div className="resort-grid">
            {casinos.slice(0, 3).map((c) => (
              <ResortCard casino={c} key={c.id} />
            ))}
          </div>
        </div>
      </section>
      <section className="section service-band">
        <div className="container-site">
          <div className="section-heading">
            <div>
              <div className="eyebrow text-gold">
                {t("EVERY DETAIL, CONSIDERED", "ΚΑΘΕ ΛΕΠΤΟΜΕΡΕΙΑ ΜΕΤΡΑΕΙ")}
              </div>
              <h2>
                {t(
                  "More than a destination. A complete journey.",
                  "Περισσότερο από προορισμός. Ένα πλήρες ταξίδι.",
                )}
              </h2>
              <p className="section-subtitle">
                {t(
                  "The right connections make all the difference.",
                  "Οι σωστές συνδέσεις κάνουν τη διαφορά.",
                )}
              </p>
            </div>
          </div>
          <ServicesGrid />
        </div>
      </section>
      <section className="section">
        <div className="container-site two-column">
          <div>
            <div className="eyebrow">
              {t("CONFIDENCE IN EVERY STEP", "ΣΙΓΟΥΡΙΑ ΣΕ ΚΑΘΕ ΒΗΜΑ")}
            </div>
            <h2>
              {t(
                "Personal service. Clear intentions.",
                "Προσωπική φροντίδα. Ξεκάθαρες προθέσεις.",
              )}
            </h2>
            <div className="info-list">
              {[
                {
                  icon: ShieldCheck,
                  title: [
                    "Independent & transparent",
                    "Ανεξάρτητοι & διαφανείς",
                  ],
                  text: [
                    "No unverified partnerships, no hidden promises. Just a clear, considered approach.",
                    "Χωρίς ανεπιβεβαίωτες συνεργασίες ή κρυφές υποσχέσεις. Μόνο ξεκάθαρη προσέγγιση.",
                  ],
                },
                {
                  icon: Lock,
                  title: ["Your privacy matters", "Το απόρρητό σας μετράει"],
                  text: [
                    "Only the details needed to coordinate your request. Never gambling or payment information.",
                    "Μόνο τα στοιχεία για τον συντονισμό του αιτήματος. Ποτέ πληροφορίες τζόγου ή πληρωμών.",
                  ],
                },
                {
                  icon: Check,
                  title: ["Travel responsibly", "Ταξιδέψτε υπεύθυνα"],
                  text: [
                    "Adults only. Local rules apply. Your wellbeing always comes first.",
                    "Μόνο ενήλικες. Ισχύουν τοπικοί κανόνες. Η ευημερία σας προηγείται.",
                  ],
                },
              ].map((i) => (
                <div key={i.title[0]}>
                  <i.icon size={22} />
                  <div>
                    <h3>{t(i.title[0], i.title[1])}</h3>
                    <p>{t(i.text[0], i.text[1])}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow">
              {t("GOOD TO KNOW", "ΧΡΗΣΙΜΕΣ ΠΛΗΡΟΦΟΡΙΕΣ")}
            </div>
            <h2>
              {t("A few thoughtful answers", "Μερικές προσεκτικές απαντήσεις")}
            </h2>
            <FAQ />
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="container-site cta-inner">
          <div>
            <h2>
              {t(
                "Your next journey starts with a conversation.",
                "Το επόμενο ταξίδι αρχίζει με μια συζήτηση.",
              )}
            </h2>
            <p>
              {t(
                "Tell us what you have in mind. We’ll help bring the details together.",
                "Πείτε μας τι έχετε στο μυαλό σας. Θα συντονίσουμε τις λεπτομέρειες.",
              )}
            </p>
          </div>
          <Button variant="secondary" asChild size="lg">
            <Link to="/request">
              {t("Make a travel enquiry", "Στείλτε ταξιδιωτικό αίτημα")}
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
function GlobeIcon() {
  return <Compass />;
}
export function Explore({ initialCountry = "0" }: { initialCountry?: string }) {
  const { t, p } = useCasino();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(initialCountry);
  const filtered = casinos.filter(
    (c) =>
      (country === "0" || c.country === Number(country)) &&
      `${c.name} ${c.city.join(" ")} ${countries[c.country]?.join(" ")}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  return (
    <main>
      <Intro
        title={["Explore casino resorts", "Ανακαλύψτε θέρετρα καζίνο"]}
        subtitle={[
          "An initial directory for thoughtful travel discovery. Confirm all facilities, eligibility and local legal status directly before travelling.",
          "Ένας αρχικός κατάλογος για προσεγμένα ταξίδια. Επιβεβαιώστε παροχές, επιλεξιμότητα και τοπικό νομικό καθεστώς απευθείας πριν ταξιδέψετε.",
        ]}
      />
      <section className="section">
        <div className="container-site">
          <div className="filter-bar">
            <input
              placeholder={t(
                "Search resort, city or country…",
                "Αναζητήστε θέρετρο, πόλη ή χώρα…",
              )}
              aria-label={t("Search resorts", "Αναζήτηση θερέτρων")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              aria-label={t("Filter by country", "Φίλτρο χώρας")}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.slice(0, 5).map((c, i) => (
                <option key={i} value={i}>
                  {p(c)}
                </option>
              ))}
            </select>
          </div>
          <p className="section-subtitle mb-6">
            {filtered.length}{" "}
            {t(
              "directory candidates · No confirmed partnerships",
              "υποψήφιοι καταλόγου · Χωρίς επιβεβαιωμένες συνεργασίες",
            )}
          </p>
          <div className="resort-grid">
            {filtered.map((c) => (
              <ResortCard casino={c} key={c.id} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="empty">
              {t(
                "No matching destinations. Try another search.",
                "Δεν βρέθηκαν προορισμοί. Δοκιμάστε άλλη αναζήτηση.",
              )}
            </p>
          )}
          <div className="notice">
            <Disclaimer />
          </div>
        </div>
      </section>
    </main>
  );
}
export function Destinations() {
  const { t } = useCasino();
  return (
    <main>
      <Intro
        title={[
          "Destinations, thoughtfully selected",
          "Προορισμοί, προσεκτικά επιλεγμένοι",
        ]}
        subtitle={[
          "Four countries. Distinctive experiences. Start with a destination and explore the initial directory.",
          "Τέσσερις χώρες. Ξεχωριστές εμπειρίες. Ξεκινήστε από έναν προορισμό και εξερευνήστε τον αρχικό κατάλογο.",
        ]}
      />
      <section className="section">
        <div className="container-site">
          <DestinationCards />
          <div className="my-6 text-center">
            <a href="/global-casinos" className="text-link">
              {t(
                "Discover US Casino Resorts & UAE planned projects →",
                "Ανακαλύψτε casino resorts στις ΗΠΑ και μελλοντικά έργα στα ΗΑΕ →",
              )}
            </a>
          </div>
          <div className="notice">
            {t(
              "Destination photography is illustrative, not a representation of a listed casino or confirmed partner. Northern Cyprus is not included as a verified jurisdiction; legal status and changing regulations must always be checked.",
              "Οι φωτογραφίες είναι ενδεικτικές, όχι απεικόνιση καταχωρημένου καζίνο ή επιβεβαιωμένου συνεργάτη. Η Βόρεια Κύπρος δεν περιλαμβάνεται ως επαληθευμένη δικαιοδοσία· το νομικό καθεστώς και οι αλλαγές κανονισμών πρέπει πάντα να ελέγχονται.",
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
export function Services() {
  const { t } = useCasino();
  return (
    <main>
      <Intro
        title={[
          "Travel, brought together",
          "Ταξίδια, με ολοκληρωμένο συντονισμό",
        ]}
        subtitle={[
          "Free enquiries for casino travel, flights, hotels, transfers, cruises and complete itineraries. For individuals, groups and companies; arrangements are reviewed manually.",
          "Δωρεάν αιτήματα για ταξίδια σε καζίνο, πτήσεις, ξενοδοχεία, μεταφορές, κρουαζιέρες και ολοκληρωμένα ταξίδια. Για ιδιώτες, ομάδες και εταιρείες· κάθε διευθέτηση εξετάζεται προσωπικά.",
        ]}
      />
      <section className="section service-band">
        <div className="container-site">
          <ServicesGrid />
        </div>
      </section>
      <section className="section">
        <div className="container-site">
          <div className="notice">
            {t(
              "External flight partner links: pending provider agreement. No live booking links or airline affiliations are available. You can submit a flight-assistance enquiry instead.",
              "Σύνδεσμοι εξωτερικών συνεργατών πτήσεων: εκκρεμεί συμφωνία παρόχου. Δεν υπάρχουν ζωντανοί σύνδεσμοι κρατήσεων ή συνεργασίες αεροπορικών. Μπορείτε να υποβάλετε αίτημα βοήθειας πτήσεων.",
            )}
          </div>
          <FAQ />
        </div>
      </section>
    </main>
  );
}
export function HowItWorks() {
  const { t } = useCasino();
  return (
    <main>
      <Intro
        title={[
          "A simpler path to your next journey",
          "Μια απλούστερη διαδρομή για το ταξίδι σας",
        ]}
        subtitle={[
          "Personal coordination begins with understanding what matters to you.",
          "Ο προσωπικός συντονισμός αρχίζει κατανοώντας τι έχει σημασία για εσάς.",
        ]}
      />
      <section className="section">
        <div className="container-site">
          <div className="steps">
            {[
              {
                title: ["Share your plans", "Μοιραστείτε τα σχέδιά σας"],
                text: [
                  "Choose your destination, dates and the support you need. Submit a travel enquiry with your contact preference.",
                  "Επιλέξτε προορισμό, ημερομηνίες και την υποστήριξη που χρειάζεστε. Υποβάλετε αίτημα με προτίμηση επικοινωνίας.",
                ],
              },
              {
                title: ["Review the details", "Εξετάστε τις λεπτομέρειες"],
                text: [
                  "Your enquiry is saved to your account for review of travel preferences, local requirements and possible provider options. Follow updates in your dashboard.",
                  "Το αίτημα αποθηκεύεται στον λογαριασμό σας για εξέταση ταξιδιωτικών προτιμήσεων, τοπικών απαιτήσεων και πιθανών παρόχων. Παρακολουθήστε ενημερώσεις στον πίνακά σας.",
                ],
              },
              {
                title: ["Confirm with providers", "Επιβεβαιώστε με παρόχους"],
                text: [
                  "Any booking is completed directly with an external provider, under their terms. We never process casino deposits or gambling transactions.",
                  "Κάθε κράτηση γίνεται απευθείας με εξωτερικό πάροχο, βάσει των όρων του. Δεν επεξεργαζόμαστε καταθέσεις καζίνο ή συναλλαγές τζόγου.",
                ],
              },
            ].map((s, i) => (
              <div key={i}>
                <div className="step-number">0{i + 1}</div>
                <h3>{t(s.title[0], s.title[1])}</h3>
                <p>{t(s.text[0], s.text[1])}</p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-10" size="lg">
            <Link to="/request">
              {t("Start your enquiry", "Ξεκινήστε το αίτημά σας")}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
export function About() {
  const { t } = useCasino();
  return (
    <main>
      <Intro
        title={[
          "Considered travel. Independent thinking.",
          "Προσεγμένα ταξίδια. Ανεξάρτητη σκέψη.",
        ]}
        subtitle={[
          "CasinoBooking.com brings independent destination information and free travel enquiries together, with clear distinctions between travel inspiration and confirmed supplier arrangements.",
          "Το CasinoBooking.com συνδυάζει ανεξάρτητη ενημέρωση προορισμών και δωρεάν ταξιδιωτικά αιτήματα, με σαφή διάκριση μεταξύ ταξιδιωτικής έμπνευσης και επιβεβαιωμένων διευθετήσεων παρόχων.",
        ]}
      />
      <section className="section">
        <div className="container-site prose-copy">
          <h2>{t("Our approach", "Η προσέγγισή μας")}</h2>
          <p>
            <Disclaimer />
          </p>
          <h2 className="flex items-center gap-3">
            <Smartphone />
            {t("Mobile app roadmap", "Σχέδιο εφαρμογής κινητού")}
          </h2>
          <p>
            {t(
              "Use the website on a phone, tablet or desktop to browse destinations and manage enquiries. Dedicated mobile apps may be considered later. No App Store or Play Store app has been published.",
              "Χρησιμοποιήστε τον ιστότοπο σε κινητό, tablet ή υπολογιστή για προορισμούς και διαχείριση αιτημάτων. Εφαρμογές κινητού ενδέχεται να εξεταστούν αργότερα. Δεν έχει δημοσιευθεί εφαρμογή σε App Store ή Play Store.",
            )}
          </p>
          <h2>
            {t(
              "Your account and enquiries",
              "Ο λογαριασμός και τα αιτήματά σας",
            )}
          </h2>
          <p>
            {t(
              "Sign in to submit and follow your travel enquiries using a unique customer reference. Enquiries are stored in your account and reviewed through restricted administration tools. Email and WhatsApp notifications are not yet connected. Supplier arrangements are confirmed separately.",
              "Συνδεθείτε για υποβολή και παρακολούθηση ταξιδιωτικών αιτημάτων με μοναδικό κωδικό πελάτη. Τα αιτήματα αποθηκεύονται στον λογαριασμό σας και εξετάζονται μέσω εργαλείων περιορισμένης πρόσβασης. Οι ειδοποιήσεις email και WhatsApp δεν έχουν συνδεθεί. Οι διευθετήσεις παρόχων επιβεβαιώνονται χωριστά.",
            )}
          </p>
          <h2>{t("Photography credits", "Πηγές φωτογραφιών")}</h2>
          <p>
            {t(
              "Illustrative travel photos by Dominik, Szőllősy Benjamin, Fajar Al Hadi and Anastasius, via Unsplash (Unsplash License). Property images remain placeholders until approved; imagery does not imply affiliation.",
              "Ενδεικτικές ταξιδιωτικές φωτογραφίες από Dominik, Szőllősy Benjamin, Fajar Al Hadi και Anastasius, μέσω Unsplash (Άδεια Unsplash). Οι εικόνες καταλυμάτων παραμένουν προσωρινές μέχρι έγκρισης· δεν υπονοείται συνεργασία.",
            )}
          </p>
          <a
            className="text-link"
            href="https://unsplash.com/license"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Photography license", "Άδεια φωτογραφιών")}
            <ArrowUpRight />
          </a>
        </div>
      </section>
    </main>
  );
}
export function Legal({ kind }: { kind: "privacy" | "terms" }) {
  const { t } = useCasino();
  return (
    <main>
      <Intro
        title={
          kind === "privacy"
            ? ["Privacy notice · draft", "Ενημέρωση απορρήτου · προσχέδιο"]
            : ["Terms of use · draft", "Όροι χρήσης · προσχέδιο"]
        }
        subtitle={[
          "Placeholder for legal review. Not a finalized legal policy.",
          "Προσωρινό κείμενο για νομικό έλεγχο. Δεν αποτελεί οριστική νομική πολιτική.",
        ]}
      />
      <section className="section">
        <div className="container-site prose-copy">
          <div className="notice">
            {t(
              "LEGAL REVIEW REQUIRED BEFORE PRODUCTION",
              "ΑΠΑΙΤΕΙΤΑΙ ΝΟΜΙΚΟΣ ΕΛΕΓΧΟΣ ΠΡΙΝ ΤΗΝ ΠΑΡΑΓΩΓΗ",
            )}
          </div>
          {kind === "privacy" ? (
            <>
              <h2>
                {t(
                  "Account and enquiry data",
                  "Δεδομένα λογαριασμού και αιτημάτων",
                )}
              </h2>
              <p>
                {t(
                  "Account and enquiry details, including your name, contact details and travel preferences, are stored in the connected account database. Signed-in customers can access their own enquiries; authorized administrators use them for travel coordination. Email and WhatsApp notifications are not yet connected. Do not submit identity documents, payment data, gambling history or sensitive information.",
                  "Τα στοιχεία λογαριασμού και αιτημάτων, όπως όνομα, επικοινωνία και ταξιδιωτικές προτιμήσεις, αποθηκεύονται στη συνδεδεμένη βάση λογαριασμών. Οι συνδεδεμένοι πελάτες βλέπουν τα δικά τους αιτήματα· εξουσιοδοτημένοι διαχειριστές τα χρησιμοποιούν για ταξιδιωτικό συντονισμό. Οι ειδοποιήσεις email και WhatsApp δεν έχουν συνδεθεί. Μην υποβάλλετε έγγραφα ταυτότητας, στοιχεία πληρωμών, ιστορικό τζόγου ή ευαίσθητες πληροφορίες.",
                )}
              </p>
              <h2>{t("Before launch", "Πριν τη δημοσίευση")}</h2>
              <p>
                {t(
                  "The controller identity, contact address, legal bases, retention periods, processors, cross-border transfers, cookies and rights procedures must be defined and reviewed. GDPR rights may include access, correction, deletion, restriction, objection and complaint to the relevant supervisory authority.",
                  "Πρέπει να οριστούν και ελεγχθούν υπεύθυνος επεξεργασίας, διεύθυνση επικοινωνίας, νομικές βάσεις, περίοδοι διατήρησης, εκτελούντες, διεθνείς διαβιβάσεις, cookies και διαδικασίες δικαιωμάτων. Τα δικαιώματα GDPR μπορεί να περιλαμβάνουν πρόσβαση, διόρθωση, διαγραφή, περιορισμό, εναντίωση και καταγγελία στην αρμόδια αρχή.",
                )}
              </p>
            </>
          ) : (
            <>
              <h2>{t("Scope and limitations", "Πεδίο και περιορισμοί")}</h2>
              <p>
                <Disclaimer />
              </p>
              <p>
                {t(
                  "Directory descriptions are cautious starting points, not legal advice, verified licensing, endorsements or guarantees of availability. The planned Hard Rock Athens development is not represented as open. Adults must verify applicable legal age, travel and entry conditions.",
                  "Οι περιγραφές είναι αφετηρίες, όχι νομική συμβουλή, επαληθευμένες άδειες, εγκρίσεις ή εγγυήσεις διαθεσιμότητας. Το υπό ανάπτυξη Hard Rock Athens δεν παρουσιάζεται ως ανοικτό. Οι ενήλικες πρέπει να ελέγχουν νόμιμη ηλικία και όρους ταξιδιού/εισόδου.",
                )}
              </p>
              <h2>{t("Responsible gambling", "Υπεύθυνο παιχνίδι")}</h2>
              <p>
                {t(
                  "Gambling carries financial and wellbeing risks. Set limits and do not chase losses. Travel must not depend on winnings. Seek independent support if gambling causes concern.",
                  "Ο τζόγος ενέχει οικονομικούς κινδύνους και κινδύνους ευημερίας. Θέστε όρια και μην κυνηγάτε απώλειες. Το ταξίδι δεν πρέπει να εξαρτάται από κέρδη. Αναζητήστε ανεξάρτητη υποστήριξη εάν υπάρχει ανησυχία.",
                )}
              </p>
              <h2>
                {t("Legal completion required", "Απαιτείται νομική ολοκλήρωση")}
              </h2>
              <p>
                {t(
                  "Operator identity, governing law, liability, complaints and provider relationship terms are pending legal review before real services begin.",
                  "Η ταυτότητα φορέα, το εφαρμοστέο δίκαιο, η ευθύνη, τα παράπονα και οι όροι παρόχων εκκρεμούν για νομικό έλεγχο πριν από πραγματικές υπηρεσίες.",
                )}
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
