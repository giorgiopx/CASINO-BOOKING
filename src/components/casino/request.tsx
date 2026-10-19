import { useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { requestTypes } from "@/lib/casino-data";
import { approvedRequestDestinations } from "@/lib/approved-casino-directory";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { useCasino } from "./context";
import {
  enquirySchema,
  localToday,
  resolveRequestDefaults,
  selectedServicesSchema,
  type RequestSearch,
} from "@/lib/casino-request-schema";
import { Intro } from "./public";
export function RequestPage({ defaults = {} }: { defaults?: RequestSearch }) {
  const { t, p } = useCasino();
  const { session, ready, available } = useAuth();
  const initial = resolveRequestDefaults(defaults);
  const [departure, setDeparture] = useState(initial.start);
  const [customerType, setCustomerType] = useState("individual");
  const submitting = useRef(false);
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState("");
  const [customerRef, setCustomerRef] = useState("");
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    setError("");
    const f = new FormData(e.currentTarget);
    const v = (key: string) => String(f.get(key) || "").trim();
    const selectedServices = selectedServicesSchema.safeParse(
      f.getAll("services"),
    );
    if (!selectedServices.success) {
      setError(
        t(
          "Select at least one travel service.",
          "Επιλέξτε τουλάχιστον μία ταξιδιωτική υπηρεσία.",
        ),
      );
      return;
    }
    const services = selectedServices.data;
    const tripPreferences = {
      flightOrigin: v("flightOrigin").slice(0, 120),
      flightDestination: v("flightDestination").slice(0, 120),
      flightType: v("flightType"),
      preferredAirline: v("preferredAirline").slice(0, 100),
      hotelCategory: v("hotelCategory"),
      rooms: v("rooms"),
      transferPickup: v("transferPickup").slice(0, 140),
      transferDestination: v("transferDestination").slice(0, 140),
      transferBags: v("transferBags"),
      vehicleType: v("vehicleType"),
      specialRequirements: v("specialRequirements").slice(0, 1200),
    };
    const parsed = enquirySchema.safeParse({
      ...Object.fromEntries(f),
      services,
    });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError(
        issue?.message === "pastDate"
          ? t(
              "Departure cannot be in the past.",
              "Η αναχώρηση δεν μπορεί να είναι στο παρελθόν.",
            )
          : issue?.message === "dateOrder"
            ? t(
                "Return date must be on or after departure.",
                "Η επιστροφή πρέπει να είναι μετά ή ίδια με την αναχώρηση.",
              )
            : issue?.path[0] === "companyName"
              ? t(
                  "Enter the company name for a business enquiry.",
                  "Συμπληρώστε την επωνυμία για εταιρικό αίτημα.",
                )
              : issue?.path[0] === "phone"
                ? t(
                    "Enter a valid phone number starting with + and the country code.",
                    "Εισάγετε έγκυρο τηλέφωνο με + και κωδικό χώρας.",
                  )
                : t(
                    "Please check the required fields, travel dates and consent.",
                    "Ελέγξτε τα υποχρεωτικά πεδία, τις ημερομηνίες και τη συγκατάθεση.",
                  ),
      );
      return;
    }
    if (!session) {
      setError(
        t(
          "Please sign in to save your enquiry.",
          "Συνδεθείτε για να αποθηκεύσετε το αίτημα.",
        ),
      );
      return;
    }
    const d = parsed.data;
    submitting.current = true;
    setBusy(true);
    try {
      const { data, error: dbError } = await supabase
        .from("enquiries")
        .insert({
          user_id: session.user.id,
          ref: "pending",
          name: d.name,
          surname: d.surname,
          email: d.email,
          phone: d.phone,
          residence: d.residence,
          customer_type: d.customerType,
          destination: d.destination,
          casino_name: v("casinoName").slice(0, 160) || null,
          company_name:
            d.customerType === "business" ? d.companyName || null : null,
          services,
          trip_preferences: tripPreferences,
          start_date: d.start,
          end_date: d.end,
          party: Number(d.party),
          request_type: d.type,
          message: d.message,
          preference: d.preference,
        })
        .select("ref")
        .single();
      if (dbError || !data?.ref || data.ref === "pending") {
        throw new Error("No confirmed enquiry reference returned");
      }
      // The returned reference confirms the save even if later profile refreshes fail.
      setRef(data.ref);
      setCustomerRef("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      void queryClient
        .invalidateQueries({ queryKey: ["enquiries"] })
        .catch(() => {});
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("customer_ref")
          .eq("id", session.user.id)
          .maybeSingle();
        setCustomerRef(prof?.customer_ref ?? "");
      } catch {
        // A profile lookup must not turn a saved enquiry into a retry/duplicate.
      }
    } catch {
      setError(
        t(
          "We could not confirm that your enquiry was saved. Check your dashboard before trying again.",
          "Δεν επιβεβαιώθηκε η αποθήκευση του αιτήματος. Ελέγξτε τον πίνακά σας πριν δοκιμάσετε ξανά.",
        ),
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <main>
      <Intro
        title={[
          "Let’s bring your journey together",
          "Ας συντονίσουμε το ταξίδι σας",
        ]}
        subtitle={[
          "Tell us about the journey you have in mind. This is a travel enquiry, not a confirmed booking.",
          "Πείτε μας για το ταξίδι που σκέφτεστε. Πρόκειται για ταξιδιωτικό αίτημα, όχι επιβεβαιωμένη κράτηση.",
        ]}
      />
      <section className="section">
        <div className="container-site">
          {ref ? (
            <div className="success-panel" role="status">
              <CheckCircle />
              <h2>
                {t(
                  "Your enquiry has been received",
                  "Το αίτημά σας παραλήφθηκε",
                )}
              </h2>
              <p className="section-subtitle">
                {t("Your request reference", "Ο αριθμός αναφοράς σας")}
              </p>
              <strong className="success-ref">{ref}</strong>
              {customerRef && (
                <p className="mt-4">
                  {t("Customer reference", "Αναφορά πελάτη")}:{" "}
                  <strong>{customerRef}</strong>
                </p>
              )}
              <p className="section-subtitle">
                {t(
                  "Saved to your account. This is not a confirmed booking. No email or WhatsApp message is sent — follow the status in your dashboard.",
                  "Αποθηκεύτηκε στον λογαριασμό σας. Δεν είναι επιβεβαιωμένη κράτηση. Δεν αποστέλλεται email ή WhatsApp — δείτε την κατάσταση στον πίνακά σας.",
                )}
              </p>
              <div className="flex justify-center gap-3 mt-7 flex-wrap">
                <Button asChild variant="secondary">
                  <Link to="/dashboard">
                    {t("View my enquiries", "Δείτε τα αιτήματά μου")}
                    <ArrowRight />
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => setRef("")}>
                  {t("New enquiry", "Νέο αίτημα")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="request-layout">
              <form onSubmit={submit} aria-busy={busy}>
                {ready && !available && (
                  <div className="notice mt-0" role="status">
                    {t(
                      "Account services are temporarily unavailable. You can browse destinations and return later to save your enquiry.",
                      "Οι υπηρεσίες λογαριασμού είναι προσωρινά μη διαθέσιμες. Μπορείτε να περιηγηθείτε στους προορισμούς και να επιστρέψετε για αποθήκευση του αιτήματος.",
                    )}
                  </div>
                )}
                {ready && available && !session && (
                  <div className="notice mt-0" role="status">
                    {t(
                      "Sign in or create a free account to submit and track your enquiry.",
                      "Συνδεθείτε ή δημιουργήστε δωρεάν λογαριασμό για να υποβάλετε και να παρακολουθείτε το αίτημα.",
                    )}{" "}
                    <Link to="/auth" className="underline">
                      {t("Sign in", "Σύνδεση")}
                    </Link>
                  </div>
                )}
                <div className="form-grid">
                  <label className="span-two">
                    {t("I am enquiring as", "Υποβάλλω αίτημα ως")} *
                    <select
                      name="customerType"
                      value={customerType}
                      onChange={(event) => setCustomerType(event.target.value)}
                    >
                      <option value="individual">
                        {t("Individual", "Ιδιώτης")}
                      </option>
                      <option value="business">
                        {t("Company", "Εταιρεία")}
                      </option>
                    </select>
                  </label>
                  <label>
                    {t("Name", "Όνομα")} *
                    <input
                      name="name"
                      required
                      maxLength={80}
                      autoComplete="given-name"
                    />
                  </label>
                  <label>
                    {t("Surname", "Επώνυμο")} *
                    <input
                      name="surname"
                      required
                      maxLength={80}
                      autoComplete="family-name"
                    />
                  </label>
                  <label>
                    {t("Email", "Email")} *
                    <input
                      name="email"
                      type="email"
                      maxLength={255}
                      required
                      autoComplete="email"
                    />
                  </label>
                  <label>
                    {t("Phone with country code", "Τηλέφωνο με κωδικό χώρας")} *
                    <input
                      name="phone"
                      type="tel"
                      maxLength={24}
                      placeholder="+30 …"
                      required
                      autoComplete="tel"
                    />
                  </label>
                  <label>
                    {t("Country of residence", "Χώρα κατοικίας")} *
                    <input
                      name="residence"
                      required
                      maxLength={80}
                      autoComplete="country-name"
                    />
                  </label>
                  {customerType === "business" && (
                    <label>
                      {t("Company name", "Επωνυμία εταιρείας")} *
                      <input
                        name="companyName"
                        maxLength={160}
                        required
                        autoComplete="organization"
                      />
                    </label>
                  )}
                  <label>
                    {t(
                      "Specific casino (optional)",
                      "Συγκεκριμένο καζίνο (προαιρετικά)",
                    )}
                    <input
                      name="casinoName"
                      maxLength={160}
                      placeholder={t(
                        "Any casino / specify name",
                        "Οποιοδήποτε / γράψτε το όνομα",
                      )}
                    />
                  </label>
                  <label className="span-two">
                    {t(
                      "Destination / casino interest",
                      "Προορισμός / καζίνο ενδιαφέροντος",
                    )}{" "}
                    *
                    <select
                      name="destination"
                      required
                      defaultValue={initial.destination}
                    >
                      <option value="">
                        {t("Select an interest", "Επιλέξτε ενδιαφέρον")}
                      </option>
                      {(["country", "venue"] as const).map((kind) => (
                        <optgroup
                          key={kind}
                          label={
                            kind === "country"
                              ? t("Countries", "Χώρες")
                              : t("Casinos", "Καζίνο")
                          }
                        >
                          {approvedRequestDestinations
                            .filter((item) => item.kind === kind)
                            .map((item) => (
                              <option key={item.value} value={item.value}>
                                {p(item.label)}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                      <option value="undecided">
                        {t("Help me choose", "Βοηθήστε με να επιλέξω")}
                      </option>
                    </select>
                  </label>
                  <fieldset
                    className="span-two"
                    style={{
                      border: "1px solid #d2c4a8",
                      padding: 18,
                      borderRadius: 8,
                    }}
                  >
                    <legend style={{ padding: "0 8px", fontWeight: 700 }}>
                      {t(
                        "Services required (select all)",
                        "Ζητούμενες υπηρεσίες (πολλαπλή επιλογή)",
                      )}
                    </legend>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(145px,1fr))",
                        gap: 12,
                      }}
                    >
                      {[
                        ["casino", "Concierge", "Concierge"],
                        ["flight", "Flights", "Αεροπορικά"],
                        ["hotel", "Hotel stay", "Διαμονή"],
                        ["transfer", "Transfers", "Μεταφορές"],
                        ["cruise", "Cruises", "Κρουαζιέρες"],
                        ["package", "Travel packages", "Ταξιδιωτικά πακέτα"],
                      ].map(([key, en, el]) => (
                        <label
                          key={key}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            name="services"
                            value={key}
                            defaultChecked={key === initial.service}
                          />
                          {t(en, el)}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="span-two">
                    <h3 style={{ fontWeight: 700, margin: "18px 0 0" }}>
                      {t("Travel preferences", "Ταξιδιωτικές προτιμήσεις")}
                    </h3>
                    <p style={{ fontSize: 12 }}>
                      {t(
                        "Complete the fields that apply. No passport or payment information is required.",
                        "Συμπληρώστε όσα ισχύουν. Δεν απαιτούνται διαβατήρια ή στοιχεία πληρωμής.",
                      )}
                    </p>
                  </div>
                  <label>
                    {t("Origin airport / city", "Αεροδρόμιο / πόλη αναχώρησης")}
                    <input
                      name="flightOrigin"
                      maxLength={120}
                      placeholder="ATH / Athens"
                    />
                  </label>
                  <label>
                    {t(
                      "Destination airport / city",
                      "Αεροδρόμιο / πόλη άφιξης",
                    )}
                    <input
                      name="flightDestination"
                      maxLength={120}
                      placeholder="NCE / Nice"
                    />
                  </label>
                  <label>
                    {t("Flight type", "Τύπος πτήσης")}
                    <select name="flightType">
                      <option value="return">
                        {t("Return", "Με επιστροφή")}
                      </option>
                      <option value="one_way">{t("One way", "Μονή")}</option>
                    </select>
                  </label>
                  <label>
                    {t("Preferred airline", "Προτιμώμενη αεροπορική")}
                    <input
                      name="preferredAirline"
                      maxLength={100}
                      placeholder={t("Any airline", "Οποιαδήποτε")}
                    />
                  </label>
                  <label>
                    {t("Hotel category", "Κατηγορία ξενοδοχείου")}
                    <select name="hotelCategory">
                      <option value="any">{t("Any", "Οποιαδήποτε")}</option>
                      <option value="4-star">4★</option>
                      <option value="5-star">5★</option>
                      <option value="resort">Resort</option>
                    </select>
                  </label>
                  <label>
                    {t("Number of rooms", "Αριθμός δωματίων")}
                    <input
                      name="rooms"
                      type="number"
                      min="1"
                      max="100"
                      defaultValue="1"
                    />
                  </label>
                  <label>
                    {t("Transfer pickup", "Σημείο παραλαβής transfer")}
                    <input name="transferPickup" maxLength={140} />
                  </label>
                  <label>
                    {t("Transfer destination", "Προορισμός transfer")}
                    <input name="transferDestination" maxLength={140} />
                  </label>
                  <label>
                    {t("Luggage", "Αποσκευές")}
                    <select name="transferBags">
                      <option value="standard">
                        {t("Standard luggage", "Τυπικές αποσκευές")}
                      </option>
                      <option value="large">
                        {t("Large / extra luggage", "Μεγάλες / επιπλέον")}
                      </option>
                    </select>
                  </label>
                  <label>
                    {t("Vehicle preference", "Επιθυμητό όχημα")}
                    <select name="vehicleType">
                      <option value="any">{t("Any", "Οποιοδήποτε")}</option>
                      <option value="sedan">Sedan</option>
                      <option value="minivan">Minivan</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </label>
                  <label className="span-two">
                    {t(
                      "Additional travel requirements",
                      "Επιπλέον ταξιδιωτικές απαιτήσεις",
                    )}
                    <textarea
                      name="specialRequirements"
                      maxLength={1200}
                      rows={3}
                    />
                  </label>
                  <label>
                    {t("Departure date", "Ημερομηνία αναχώρησης")} *
                    <input
                      name="start"
                      type="date"
                      required
                      value={departure}
                      min={localToday()}
                      onChange={(event) => setDeparture(event.target.value)}
                    />
                  </label>
                  <label>
                    {t("Return date", "Ημερομηνία επιστροφής")} *
                    <input
                      name="end"
                      type="date"
                      required
                      min={departure || localToday()}
                      defaultValue={initial.end}
                    />
                  </label>
                  <label>
                    {t("Party size (adults)", "Μέγεθος ομάδας (ενήλικες)")} *
                    <input
                      name="party"
                      type="number"
                      min="1"
                      max="200"
                      required
                      defaultValue={initial.party}
                    />
                  </label>
                  <label>
                    {t("Request type", "Τύπος αιτήματος")} *
                    <select name="type" defaultValue={initial.requestType}>
                      {Object.entries(requestTypes).map(([k, v]) => (
                        <option key={k} value={k}>
                          {p(v)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="span-two">
                    {t("Your message", "Το μήνυμά σας")}
                    <textarea
                      rows={4}
                      name="message"
                      maxLength={2000}
                      placeholder={t(
                        "Travel preferences only — no financial or gambling information.",
                        "Μόνο ταξιδιωτικές προτιμήσεις — όχι οικονομικά στοιχεία ή πληροφορίες τζόγου.",
                      )}
                    />
                  </label>
                  <label className="span-two">
                    {t(
                      "Preferred contact method",
                      "Προτιμώμενος τρόπος επικοινωνίας",
                    )}
                    <select name="preference">
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </label>
                  <div className="span-two notice my-0">
                    {t(
                      "Privacy notice: your enquiry is stored securely in your account and visible only to you and authorised administrators. Do not include financial, identity or gambling information. Email/WhatsApp delivery is not yet connected.",
                      "Ειδοποίηση απορρήτου: το αίτημα αποθηκεύεται με ασφάλεια στον λογαριασμό σας και είναι ορατό μόνο σε εσάς και εξουσιοδοτημένους διαχειριστές. Μην περιλαμβάνετε οικονομικά στοιχεία, ταυτότητα ή πληροφορίες τζόγου. Η αποστολή email/WhatsApp δεν έχει συνδεθεί ακόμη.",
                    )}{" "}
                    <Link to="/privacy" className="underline">
                      {t(
                        "Read the privacy draft",
                        "Διαβάστε το προσχέδιο απορρήτου",
                      )}
                    </Link>
                    .
                  </div>
                  <label className="span-two consent-label">
                    <input name="consent" type="checkbox" required />
                    <span>
                      {t(
                        "I confirm I am an adult of the applicable legal age, understand this is a travel enquiry and not a booking, and consent to my details being stored to handle this enquiry.",
                        "Επιβεβαιώνω ότι είμαι ενήλικας της νόμιμης ηλικίας, κατανοώ ότι πρόκειται για ταξιδιωτικό αίτημα και όχι κράτηση, και συναινώ στην αποθήκευση των στοιχείων μου για τη διαχείρισή του.",
                      )}{" "}
                      *
                    </span>
                  </label>
                  {error && (
                    <p role="alert" className="span-two text-destructive">
                      {error}
                    </p>
                  )}
                  <div className="span-two">
                    <Button
                      variant="secondary"
                      size="lg"
                      type="submit"
                      disabled={busy || !ready || !available || !session}
                    >
                      {busy
                        ? t("Saving enquiry…", "Αποθήκευση αιτήματος…")
                        : t(
                            "Submit travel enquiry",
                            "Υποβολή ταξιδιωτικού αιτήματος",
                          )}
                      <ArrowRight />
                    </Button>
                  </div>
                </div>
              </form>
              <aside className="form-aside">
                <ShieldCheck className="text-gold mb-4" />
                <h3>
                  {t(
                    "Every detail, with care.",
                    "Κάθε λεπτομέρεια, με φροντίδα.",
                  )}
                </h3>
                <p>
                  {t(
                    "Your reference makes it easy to find your enquiry in your dashboard. This does not confirm a booking, partnership or availability.",
                    "Ο αριθμός αναφοράς σας βοηθά να βρείτε το αίτημα στον πίνακά σας. Δεν επιβεβαιώνει κράτηση, συνεργασία ή διαθεσιμότητα.",
                  )}
                </p>
                <p>
                  {t(
                    "We never request casino deposits, payment information, identity documents or gambling history.",
                    "Δεν ζητάμε καταθέσεις καζίνο, πληροφορίες πληρωμών, έγγραφα ταυτότητας ή ιστορικό τζόγου.",
                  )}
                </p>
                <p>
                  {t(
                    "Adults only. Verify local laws and entry requirements before making travel plans.",
                    "Μόνο ενήλικες. Ελέγξτε τοπικούς νόμους και απαιτήσεις εισόδου πριν σχεδιάσετε ταξίδι.",
                  )}
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
export function Contact() {
  const { t } = useCasino();
  return (
    <main>
      <Intro
        title={[
          "A conversation worth starting",
          "Μια συζήτηση που αξίζει να αρχίσει",
        ]}
        subtitle={[
          "For individual travel, business groups or future provider enquiries, start with a demo request.",
          "Για ατομικά ταξίδια, επιχειρηματικές ομάδες ή μελλοντικούς παρόχους, ξεκινήστε με αίτημα επίδειξης.",
        ]}
      />
      <section className="section">
        <div className="container-site two-column">
          <div>
            <h2 className="page-title">
              {t("Tell us what you have in mind", "Πείτε μας τι σκέφτεστε")}
            </h2>
            <p className="section-subtitle">
              {t(
                "No public phone number, email or WhatsApp channel has been verified yet. The enquiry form is the working demonstration contact point; it does not send messages.",
                "Δεν έχει επαληθευτεί δημόσιο τηλέφωνο, email ή κανάλι WhatsApp. Η φόρμα είναι λειτουργικό σημείο επίδειξης επικοινωνίας· δεν στέλνει μηνύματα.",
              )}
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-6">
              <Link to="/request">
                {t("Open enquiry form", "Άνοιγμα φόρμας αιτήματος")}
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="notice">
            {t(
              "Production contact details and data-controller identity must be confirmed before real enquiries are accepted.",
              "Τα πραγματικά στοιχεία επικοινωνίας και η ταυτότητα υπευθύνου επεξεργασίας πρέπει να επιβεβαιωθούν πριν γίνουν δεκτά πραγματικά αιτήματα.",
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
