import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { casinos, countries, requestTypes } from "@/lib/casino-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { useCasino } from "./context";
import { enquirySchema } from "@/lib/casino-request-schema";
import { Intro } from "./public";
export function RequestPage({
  defaults = {},
}: {
  defaults?: { interest?: string | undefined; country?: string | undefined; start?: string | undefined; party?: string | undefined; type?: string | undefined };
}) {
  const { t, p } = useCasino();
  const { session, ready } = useAuth();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState("");
  const [customerRef, setCustomerRef] = useState("");
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (key: string) => String(f.get(key) || "").trim();
    if (v("end") < v("start")) {
      setError(
        t(
          "Return date must be on or after departure.",
          "Η επιστροφή πρέπει να είναι μετά ή ίδια με την αναχώρηση.",
        ),
      );
      return;
    }
    if (!/^\+[\d\s()-]{7,22}$/.test(v("phone"))) {
      setError(
        t(
          "Enter a phone number starting with + and the country code.",
          "Εισάγετε τηλέφωνο με + και κωδικό χώρας.",
        ),
      );
      return;
    }
    const parsed = enquirySchema.safeParse(Object.fromEntries(f));
    if (!parsed.success) {
      setError(t("Please check all required fields and use valid sample details.", "Ελέγξτε όλα τα υποχρεωτικά πεδία και χρησιμοποιήστε έγκυρα ενδεικτικά στοιχεία."));
      return;
    }
    if (!session) {
      setError(t("Please sign in to save your enquiry.", "Συνδεθείτε για να αποθηκεύσετε το αίτημα."));
      return;
    }
    const d = parsed.data;
    setBusy(true);
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
        start_date: d.start,
        end_date: d.end,
        party: Number(d.party),
        request_type: d.type,
        message: d.message,
        preference: d.preference,
      })
      .select("ref")
      .single();
    if (dbError || !data) {
      setBusy(false);
      setError(t("Your enquiry could not be saved. Please try again.", "Το αίτημα δεν αποθηκεύτηκε. Δοκιμάστε ξανά."));
      return;
    }
    const { data: prof } = await supabase.from("profiles").select("customer_ref").eq("id", session.user.id).maybeSingle();
    setBusy(false);
    queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    setRef(data.ref);
    setCustomerRef(prof?.customer_ref ?? "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <main>
      <Intro
        title={["Let’s bring your journey together", "Ας συντονίσουμε το ταξίδι σας"]}
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
              <h2>{t("Your enquiry has been received", "Το αίτημά σας παραλήφθηκε")}</h2>
              <p className="section-subtitle">
                {t("Your request reference", "Ο αριθμός αναφοράς σας")}
              </p>
              <strong className="success-ref">{ref}</strong>
              <p className="mt-4">{t("Customer reference", "Αναφορά πελάτη")}: <strong>{customerRef}</strong></p>
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
              <form onSubmit={submit}>
                {ready && !session && (
                  <div className="notice mt-0" role="status">
                    {t("Sign in or create a free account to submit and track your enquiry.", "Συνδεθείτε ή δημιουργήστε δωρεάν λογαριασμό για να υποβάλετε και να παρακολουθείτε το αίτημα.")}{" "}
                    <Link to="/auth" className="underline">{t("Sign in", "Σύνδεση")}</Link>
                  </div>
                )}
                <div className="form-grid">
                  <label>
                    {t("Name", "Όνομα")} *
                    <input name="name" required maxLength={80} autoComplete="given-name" />
                  </label>
                  <label>
                    {t("Surname", "Επώνυμο")} *
                    <input name="surname" required maxLength={80} autoComplete="family-name" />
                  </label>
                  <label>
                    {t("Email", "Email")} *
                    <input name="email" type="email" maxLength={255} required autoComplete="email" />
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
                    <input name="residence" required maxLength={80} autoComplete="country-name" />
                  </label>
                  <label>
                    {t("Customer type", "Τύπος πελάτη")} *
                    <select name="customerType">
                      <option value="individual">{t("Individual", "Ιδιώτης")}</option>
                      <option value="business">{t("Business", "Επιχείρηση")}</option>
                    </select>
                  </label>
                  <label className="span-two">
                    {t("Destination / casino interest", "Προορισμός / καζίνο ενδιαφέροντος")} *
                    <select
                      name="destination"
                      required
                      defaultValue={
                        defaults.interest ||
                        (Number(defaults.country) > 0 ? countries[Number(defaults.country)]?.[0] : "")
                      }
                    >
                      <option value="">{t("Select an interest", "Επιλέξτε ενδιαφέρον")}</option>
                      {casinos.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                          {c.planned
                            ? t(" · planned, not open", " · υπό ανάπτυξη, μη ανοικτό")
                            : ""}
                        </option>
                      ))}
                      {countries.slice(1).map((c) => (
                        <option key={c[0]} value={c[0]}>
                          {p(c)}
                        </option>
                      ))}
                      <option value="undecided">
                        {t("Help me choose", "Βοηθήστε με να επιλέξω")}
                      </option>
                    </select>
                  </label>
                  <label>
                    {t("Departure date", "Ημερομηνία αναχώρησης")} *
                    <input name="start" type="date" required defaultValue={defaults.start} />
                  </label>
                  <label>
                    {t("Return date", "Ημερομηνία επιστροφής")} *
                    <input name="end" type="date" required />
                  </label>
                  <label>
                    {t("Party size (adults)", "Μέγεθος ομάδας (ενήλικες)")} *
                    <input
                      name="party"
                      type="number"
                      min="1"
                      max="200"
                      required
                      defaultValue={defaults.party || "2"}
                    />
                  </label>
                  <label>
                    {t("Request type", "Τύπος αιτήματος")} *
                    <select name="type" defaultValue={defaults.type || "introduction"}>
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
                    {t("Preferred contact method", "Προτιμώμενος τρόπος επικοινωνίας")}
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
                      {t("Read the privacy draft", "Διαβάστε το προσχέδιο απορρήτου")}
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
                    <Button variant="secondary" size="lg" type="submit" disabled={busy || !session}>
                      {t("Submit travel enquiry", "Υποβολή ταξιδιωτικού αιτήματος")}
                      <ArrowRight />
                    </Button>
                  </div>
                </div>
              </form>
              <aside className="form-aside">
                <ShieldCheck className="text-gold mb-4" />
                <h3>{t("Every detail, with care.", "Κάθε λεπτομέρεια, με φροντίδα.")}</h3>
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
        title={["A conversation worth starting", "Μια συζήτηση που αξίζει να αρχίσει"]}
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