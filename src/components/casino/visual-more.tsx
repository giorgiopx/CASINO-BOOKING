import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Crown,
  Headphones,
  Hotel,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  UserRound,
  Users,
  CarFront,
  Globe2,
  Mail,
  LockKeyhole,
} from "lucide-react";
import { useCasino } from "./context";
import {
  approvedCountries,
  approvedTotals,
  countryVenues,
} from "@/lib/approved-casino-directory";
import "./visual-more.css";

const featured = ["monaco", "cyprus", "italy", "france"];
const journeys = [
  {
    en: "Mediterranean cruise enquiries",
    el: "Κρουαζιέρες στη Μεσόγειο",
    detail: [
      "Ports, hotels and tailored travel assistance",
      "Λιμάνια, ξενοδοχεία και προσωπική ταξιδιωτική βοήθεια",
    ],
    file: "Cruise ship in Mediterranean.jpg",
    credit: "Mervat · CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Cruise_ship_in_Mediterranean.jpg",
  },
  {
    en: "Island & coastal itineraries",
    el: "Νησιωτικά και παραθαλάσσια ταξίδια",
    detail: [
      "Discover coastal destinations and cruise routes",
      "Γνωρίστε παράκτιους προορισμούς και διαδρομές",
    ],
    file: "Cruise ship in the coast waters of Mykonos island. Cyclades, Agean Sea, Greece.jpg",
    credit: "Mstyslav Chernov · CC BY-SA 3.0",
    page: "https://commons.wikimedia.org/wiki/File:Cruise_ship_in_the_coast_waters_of_Mykonos_island._Cyclades,_Agean_Sea,_Greece.jpg",
  },
  {
    en: "Worldwide cruise inspiration",
    el: "Ιδέες για κρουαζιέρες διεθνώς",
    detail: [
      "Ask for options tailored to your interests",
      "Ζητήστε επιλογές σύμφωνα με τα ενδιαφέροντά σας",
    ],
    file: "Sunset on a Cruise Ship (3725700094).jpg",
    credit: "Rennett Stowe · CC BY 2.0",
    page: "https://commons.wikimedia.org/wiki/File:Sunset_on_a_Cruise_Ship_(3725700094).jpg",
  },
];
const imageFromCommons = (file: string) =>
  "https://commons.wikimedia.org/wiki/Special:FilePath/" +
  encodeURIComponent(file);

const questions: Array<{ q: [string, string]; a: [string, string] }> = [
  {
    q: [
      "Are these confirmed casino bookings?",
      "Πρόκειται για επιβεβαιωμένες κρατήσεις καζίνο;",
    ],
    a: [
      "No. CasinoBooking is an independent travel-enquiry platform. We review your request before any possible arrangement, subject to availability, legal requirements and supplier confirmation.",
      "Όχι. Το CasinoBooking είναι ανεξάρτητη πλατφόρμα ταξιδιωτικών αιτημάτων. Εξετάζουμε το αίτημά σας πριν από οποιαδήποτε ενδεχόμενη διευθέτηση, σύμφωνα με τη διαθεσιμότητα, τη νομοθεσία και την επιβεβαίωση παρόχων.",
    ],
  },
  {
    q: [
      "Which destinations are included?",
      "Ποιοι προορισμοί περιλαμβάνονται;",
    ],
    a: [
      "Our directory covers 15 countries with 51 operator-listed venue candidates and one separately marked future UAE project. Operating status and legal eligibility require checking before travel.",
      "Ο κατάλογος περιλαμβάνει 15 χώρες με 51 καταχωρισμένους υποψήφιους χώρους και ένα χωριστά χαρακτηρισμένο μελλοντικό έργο στα ΗΑΕ. Η λειτουργία και οι νόμιμες προϋποθέσεις ελέγχονται πριν από το ταξίδι.",
    ],
  },
  {
    q: ["Is the enquiry free?", "Είναι δωρεάν η αποστολή αιτήματος;"],
    a: [
      "Yes. Submitting a travel enquiry is free. It does not create a reservation, charge or casino admission.",
      "Ναι. Η υποβολή ταξιδιωτικού αιτήματος είναι δωρεάν. Δεν δημιουργεί κράτηση, χρέωση ή δικαίωμα εισόδου σε καζίνο.",
    ],
  },
  {
    q: [
      "Can I ask about flights, hotels and transfers?",
      "Μπορώ να ζητήσω πτήσεις, ξενοδοχεία και μεταφορές;",
    ],
    a: [
      "Yes. Describe the travel services you want in the request form. Live inventory, prices and automatic supplier booking are not connected.",
      "Ναι. Περιγράψτε τις ταξιδιωτικές υπηρεσίες στη φόρμα αιτήματος. Δεν έχει συνδεθεί ζωντανή διαθεσιμότητα, τιμολόγηση ή αυτόματη κράτηση παρόχων.",
    ],
  },
  {
    q: [
      "How do I follow the status of my request?",
      "Πώς παρακολουθώ την κατάσταση του αιτήματός μου;",
    ],
    a: [
      "Create an account to see your unique customer reference and the enquiries associated with your account. Customer and administrator functions are being validated before public release.",
      "Δημιουργήστε λογαριασμό για να βλέπετε τον μοναδικό κωδικό πελάτη και τα αιτήματα του λογαριασμού σας. Οι λειτουργίες πελατών και διαχειριστών ελέγχονται πριν από τη δημόσια διάθεση.",
    ],
  },
  {
    q: ["What age restrictions apply?", "Ποια ηλικιακά όρια ισχύουν;"],
    a: [
      "Adults only. Minimum age, identity requirements, local legislation and casino entry policies vary by jurisdiction and must be confirmed with the relevant operator.",
      "Μόνο ενήλικες. Το ελάχιστο όριο ηλικίας, τα στοιχεία ταυτοποίησης, οι τοπικοί νόμοι και οι όροι εισόδου διαφέρουν ανά περιοχή και πρέπει να επιβεβαιώνονται με τον διαχειριστή.",
    ],
  },
];

export function VisualMore() {
  const { t, lang } = useCasino();
  return (
    <div className="cb-extra">
      <section
        className="cb-extra-trust"
        aria-label={t(
          "Travel services overview",
          "Πληροφορίες ταξιδιωτικών υπηρεσιών",
        )}
      >
        <div>
          <MapPin aria-hidden="true" />
          <span>
            <strong>
              {t("Selected destinations", "Επιλεγμένοι προορισμοί")}
            </strong>
            <small>
              {approvedTotals.countries}{" "}
              {t("countries in our directory", "χώρες στον κατάλογο")}
            </small>
          </span>
        </div>
        <div>
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>
              {t("Independent information", "Ανεξάρτητη ενημέρωση")}
            </strong>
            <small>
              {t("Official operator sources", "Επίσημες πηγές διαχειριστών")}
            </small>
          </span>
        </div>
        <div>
          <Headphones aria-hidden="true" />
          <span>
            <strong>
              {t("Personal travel enquiries", "Προσωπικά ταξιδιωτικά αιτήματα")}
            </strong>
            <small>
              {t("Follow your request online", "Παρακολουθήστε το αίτημά σας")}
            </small>
          </span>
        </div>
        <Link to="/request" className="cb-extra-gold-cta">
          <Crown aria-hidden="true" size={20} />
          <span>
            {t("Request Free Concierge", "Δωρεάν αίτημα concierge")}
            <small>
              {t(
                "Hotels · Flights · Transfers",
                "Ξενοδοχεία · Πτήσεις · Μεταφορές",
              )}
            </small>
          </span>
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="cb-extra-section" id="featured">
        <div className="cb-extra-heading">
          <div>
            <p className="cb-extra-kicker">{t("DISCOVER", "ΑΝΑΚΑΛΥΨΤΕ")}</p>
            <h2>{t("Featured Destinations", "Επιλεγμένοι Προορισμοί")}</h2>
            <p>
              {t(
                "European travel inspiration, casino locations and independently researched operator details.",
                "Ευρωπαϊκοί ταξιδιωτικοί προορισμοί, καζίνο και πληροφορίες από επίσημες πηγές.",
              )}
            </p>
          </div>
          <Link to="/destinations">
            {t("View all 15 countries", "Δείτε και τις 15 χώρες")}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="cb-extra-featured">
          {featured.map((slug, i) => {
            const c = approvedCountries.find((x) => x.slug === slug);
            if (!c) return null;
            const count = countryVenues(slug).length;
            return (
              <article className="cb-extra-feature-card" key={slug}>
                <div className="cb-extra-feature-image">
                  <img
                    loading="lazy"
                    src={"/design-reference/" + slug + ".webp"}
                    alt={t(c.name[0], c.name[1]) + " travel destination"}
                  />
                  {i === 0 && (
                    <span className="cb-extra-feature-badge">
                      {t("FEATURED", "ΕΠΙΛΕΓΜΕΝΟ")}
                    </span>
                  )}
                </div>
                <div className="cb-extra-feature-body">
                  <h3>
                    {c.flag} {t(c.name[0], c.name[1])}
                  </h3>
                  <p>
                    {t(
                      "Explore destinations, culture and casino travel options in this region.",
                      "Γνωρίστε τον προορισμό, τον πολιτισμό και τις ταξιδιωτικές επιλογές.",
                    )}
                  </p>
                  <div className="cb-extra-inline-stats">
                    <span>
                      <MapPin size={15} />
                      {count} {t("venue candidates", "υποψήφιοι χώροι")}
                    </span>
                    <span>
                      <Hotel size={15} />
                      {t("Travel planning", "Ταξιδιωτική οργάνωση")}
                    </span>
                  </div>
                  <Link
                    to="/destination/$slug"
                    params={{ slug }}
                    className="cb-extra-outline"
                  >
                    {t("Explore Destination", "Εξερεύνηση προορισμού")}{" "}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="cb-extra-cruises" id="cruises">
        <div
          className="cb-extra-cruise-bg"
          role="img"
          aria-label={t("Cruise vessel at sea", "Κρουαζιερόπλοιο στη θάλασσα")}
        />
        <div className="cb-extra-cruise-left">
          <p className="cb-extra-kicker">
            {t("CRUISE INSPIRATION", "ΙΔΕΕΣ ΓΙΑ ΚΡΟΥΑΖΙΕΡΕΣ")}
          </p>
          <h2>{t("Casino Cruises", "Κρουαζιέρες με Καζίνο")}</h2>
          <h3>
            {t(
              "Remarkable journeys. Personal coordination.",
              "Μοναδικά ταξίδια. Προσωπική οργάνωση.",
            )}
          </h3>
          <p>
            {t(
              "Tell us your preferred route and dates. We'll review your enquiry; cruise inventory and onboard casino access are not confirmed here.",
              "Ενημερώστε μας για τη διαδρομή και τις ημερομηνίες σας. Θα εξετάσουμε το αίτημα· δεν παρέχεται επιβεβαιωμένη διαθεσιμότητα ή πρόσβαση σε καζίνο πλοίων.",
            )}
          </p>
          <Link
            to="/request"
            search={{ type: "introduction" }}
            className="cb-extra-gold-cta"
          >
            {t("Enquire About Cruises", "Αίτημα για κρουαζιέρα")}{" "}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="cb-extra-cruise-cards">
          {journeys.map((j) => (
            <article key={j.en} className="cb-extra-cruise-card">
              <img
                loading="lazy"
                src={imageFromCommons(j.file)}
                alt={t(j.en, j.el)}
              />
              <h3>{t(j.en, j.el)}</h3>
              <p>{t(j.detail[0], j.detail[1])}</p>
              <Link to="/request">
                {t("Send Enquiry", "Αποστολή αιτήματος")}{" "}
                <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
        <div className="cb-extra-attribution">
          {journeys.map((j) => (
            <a
              key={j.en}
              href={j.page}
              target="_blank"
              rel="noopener noreferrer"
            >
              {j.credit}
            </a>
          ))}
        </div>
      </section>

      <section className="cb-extra-concierge" id="concierge">
        <div className="cb-extra-concierge-copy">
          <p className="cb-extra-kicker">CASINOBOOKING.COM</p>
          <h2>{t("Travel Concierge", "Ταξιδιωτική Οργάνωση")}</h2>
          <h3>
            {t(
              "Your journey, carefully considered.",
              "Το ταξίδι σας, με προσεκτική οργάνωση.",
            )}
          </h3>
          <p>
            {t(
              "Tell us what you have in mind. Our free enquiry form lets you describe flights, accommodation, transfers and group arrangements.",
              "Περιγράψτε τι ταξίδι θέλετε. Η δωρεάν φόρμα αιτήματος καλύπτει πτήσεις, διαμονή, μεταφορές και ομαδικά ταξίδια.",
            )}
          </p>
          <Link to="/request" className="cb-extra-gold-cta">
            {t("Submit a Travel Enquiry", "Υποβολή Ταξιδιωτικού Αιτήματος")}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="cb-extra-service-tiles">
          {[
            { icon: Hotel, en: "Hotels", el: "Ξενοδοχεία" },
            { icon: Plane, en: "Flights", el: "Πτήσεις" },
            { icon: CarFront, en: "Transfers", el: "Μεταφορές" },
            { icon: Ship, en: "Cruises", el: "Κρουαζιέρες" },
            { icon: Users, en: "Groups", el: "Ομάδες" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Link to="/request" key={s.en}>
                <Icon aria-hidden="true" />
                <strong>{t(s.en, s.el)}</strong>
                <small>{t("Request assistance", "Ζητήστε βοήθεια")}</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="cb-extra-section cb-extra-process" id="how-it-works">
        <div className="cb-extra-heading">
          <div>
            <p className="cb-extra-kicker">
              {t("OUR PROCESS", "Η ΔΙΑΔΙΚΑΣΙΑ")}
            </p>
            <h2>{t("How It Works", "Πώς Λειτουργεί")}</h2>
            <p>
              {t(
                "Four straightforward steps to start planning your trip — without paying or making a confirmed booking.",
                "Τέσσερα απλά βήματα για να σχεδιάσετε ένα ταξίδι, χωρίς πληρωμή ή αυτόματη επιβεβαίωση κράτησης.",
              )}
            </p>
          </div>
        </div>
        <div className="cb-extra-steps">
          {[
            {
              icon: ClipboardList,
              en: "Send an enquiry",
              el: "Στείλτε αίτημα",
              detail: [
                "Share your destination, dates and preferences.",
                "Γράψτε προορισμό, ημερομηνίες και προτιμήσεις.",
              ],
            },
            {
              icon: UserRound,
              en: "Request review",
              el: "Εξέταση αιτήματος",
              detail: [
                "Your enquiry is reviewed for available options.",
                "Το αίτημά σας εξετάζεται για διαθέσιμες επιλογές.",
              ],
            },
            {
              icon: CalendarDays,
              en: "Discuss an itinerary",
              el: "Συζήτηση προγράμματος",
              detail: [
                "Discuss any feasible arrangement before confirming.",
                "Συζητήστε τυχόν εφικτές επιλογές πριν την επιβεβαίωση.",
              ],
            },
            {
              icon: Plane,
              en: "Plan your journey",
              el: "Οργανώστε το ταξίδι",
              detail: [
                "Proceed separately with authorized suppliers.",
                "Συνεχίστε χωριστά με εξουσιοδοτημένους παρόχους.",
              ],
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.en} className="cb-extra-step">
                <span className="cb-extra-step-no">{i + 1}</span>
                <span className="cb-extra-step-icon">
                  <Icon />
                </span>
                <h3>{t(s.en, s.el)}</h3>
                <p>{t(s.detail[0], s.detail[1])}</p>
                {i < 3 && <ChevronRight className="cb-extra-step-arrow" />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="cb-extra-portals cb-extra-section" id="account">
        <div className="cb-extra-portal-card">
          <div>
            <p className="cb-extra-kicker">
              {t("YOUR ACCOUNT", "Ο ΛΟΓΑΡΙΑΣΜΟΣ ΣΑΣ")}
            </p>
            <h2>{t("Your Customer Dashboard", "Ο Πίνακας Πελάτη")}</h2>
            <p>
              {t(
                "Keep your enquiries, unique customer reference and personal travel details together.",
                "Δείτε τα αιτήματά σας, τον μοναδικό κωδικό πελάτη και τις ταξιδιωτικές πληροφορίες.",
              )}
            </p>
            <ul>
              <li>
                <CheckCircle2 />
                {t("Personal customer reference", "Προσωπικός κωδικός πελάτη")}
              </li>
              <li>
                <CheckCircle2 />
                {t("Enquiry status history", "Ιστορικό κατάστασης αιτημάτων")}
              </li>
              <li>
                <CheckCircle2 />
                {t(
                  "Protected account access",
                  "Προστατευμένη πρόσβαση λογαριασμού",
                )}
              </li>
            </ul>
            <Link to="/dashboard" className="cb-extra-gold-cta">
              {t("Open Customer Dashboard", "Άνοιγμα Πίνακα Πελάτη")}{" "}
              <ArrowRight size={15} />
            </Link>
          </div>
          <div
            className="cb-extra-dashboard-illustration"
            aria-label={t(
              "Illustrative preview of customer account layout",
              "Ενδεικτική προεπισκόπηση λογαριασμού",
            )}
          >
            <header>
              ♠ CasinoBooking.com{" "}
              <span>{t("My account", "Ο λογαριασμός μου")}</span>
            </header>
            <div className="cb-extra-dashboard-columns">
              <aside>
                <b>{t("Account menu", "Μενού")}</b>
                <span>{t("My enquiries", "Τα αιτήματά μου")}</span>
                <span>{t("Profile", "Προφίλ")}</span>
                <span>{t("Account settings", "Ρυθμίσεις")}</span>
              </aside>
              <article>
                <small>
                  {t(
                    "Illustrative layout · no sample customer data",
                    "Ενδεικτικό σχέδιο · χωρίς δεδομένα πελατών",
                  )}
                </small>
                <h3>{t("My enquiries", "Τα αιτήματά μου")}</h3>
                <div className="cb-extra-faux-row">
                  <ClipboardList />
                  <span>
                    {t(
                      "Your requests appear here after sign-in",
                      "Τα αιτήματά σας εμφανίζονται μετά τη σύνδεση",
                    )}
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>
        <div className="cb-extra-portal-card">
          <div>
            <p className="cb-extra-kicker">
              {t("PROTECTED BACK OFFICE", "ΠΡΟΣΤΑΤΕΥΜΕΝΗ ΔΙΑΧΕΙΡΙΣΗ")}
            </p>
            <h2>{t("Admin CRM", "Διαχείριση CRM")}</h2>
            <p>
              {t(
                "Restricted management of clients, enquiries, status updates and travel coordination.",
                "Πρόσβαση μόνο διαχειριστή σε πελάτες, αιτήματα, ενημερώσεις κατάστασης και ταξιδιωτικό συντονισμό.",
              )}
            </p>
            <ul>
              <li>
                <CheckCircle2 />
                {t(
                  "Enquiry tracking and customer profiles",
                  "Παρακολούθηση αιτημάτων και πελατών",
                )}
              </li>
              <li>
                <CheckCircle2 />
                {t(
                  "Role-restricted administrator access",
                  "Πρόσβαση με δικαιώματα διαχειριστή",
                )}
              </li>
              <li>
                <CheckCircle2 />
                {t(
                  "Status changes and audit history",
                  "Αλλαγές κατάστασης και ιστορικό",
                )}
              </li>
            </ul>
            <Link to="/admin" className="cb-extra-gold-cta">
              {t("Open Admin CRM", "Άνοιγμα CRM")} <LockKeyhole size={15} />
            </Link>
          </div>
          <div
            className="cb-extra-dashboard-illustration cb-extra-admin-illustration"
            aria-label={t(
              "Illustrative CRM interface, no live customer data",
              "Ενδεικτικό περιβάλλον CRM χωρίς πραγματικά δεδομένα",
            )}
          >
            <header>
              ♠ CasinoBooking.com <span>CRM</span>
            </header>
            <div className="cb-extra-dashboard-columns">
              <aside>
                <b>Admin</b>
                <span>{t("Customers", "Πελάτες")}</span>
                <span>{t("Enquiries", "Αιτήματα")}</span>
                <span>{t("Settings", "Ρυθμίσεις")}</span>
              </aside>
              <article>
                <small>{t("Restricted access", "Περιορισμένη πρόσβαση")}</small>
                <h3>{t("Enquiry management", "Διαχείριση αιτημάτων")}</h3>
                <div className="cb-extra-faux-row">
                  <ShieldCheck />
                  <span>
                    {t(
                      "Admin login required",
                      "Απαιτείται σύνδεση διαχειριστή",
                    )}
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="cb-extra-section cb-extra-faq" id="faq">
        <div>
          <p className="cb-extra-kicker">FAQ</p>
          <h2>{t("Frequently Asked Questions", "Συχνές Ερωτήσεις")}</h2>
          <p>
            {t(
              "Helpful answers about our destinations, free enquiries and account features.",
              "Απαντήσεις για τους προορισμούς, τα δωρεάν αιτήματα και τους λογαριασμούς.",
            )}
          </p>
          <Link to="/contact" className="cb-extra-gold-cta">
            {t("Contact Us", "Επικοινωνήστε μαζί μας")} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="cb-extra-accordion">
          {questions.map((item, i) => (
            <details key={item.q[0]} open={i === 0}>
              <summary>{t(item.q[0], item.q[1])}</summary>
              <p>{t(item.a[0], item.a[1])}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cb-extra-finale">
        <div>
          <h2>
            {t(
              "Ready to Explore Your Next Destination?",
              "Έτοιμοι για τον Επόμενο Προορισμό;",
            )}
          </h2>
          <p>
            {t(
              "Browse the destinations and submit a free travel enquiry. No booking or payment is made online.",
              "Δείτε τους προορισμούς και υποβάλετε ένα δωρεάν ταξιδιωτικό αίτημα. Δεν πραγματοποιούνται online κρατήσεις ή πληρωμές.",
            )}
          </p>
        </div>
        <Link to="/request" className="cb-extra-gold-cta">
          {t("Submit a Travel Enquiry", "Αποστολή Ταξιδιωτικού Αιτήματος")}
          <ArrowRight size={17} />
        </Link>
      </section>
      <footer className="cb-extra-footer">
        <div className="cb-extra-footer-top">
          <div className="cb-extra-footer-brand">
            <Link to="/">♠ CasinoBooking.com</Link>
            <small>CASINOS · RESORTS · CRUISES · TRAVEL</small>
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
            <Link to="/explore">
              {t("Casino directory", "Κατάλογος καζίνο")}
            </Link>
            <Link to="/global-casinos">
              {t("International casinos", "Διεθνή καζίνο")}
            </Link>
          </div>
          <div>
            <h3>{t("Your Journey", "Το ταξίδι σας")}</h3>
            <Link to="/request">
              {t("Free travel enquiry", "Δωρεάν αίτημα")}
            </Link>
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
    </div>
  );
}
