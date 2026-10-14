import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Inbox,
  Building2,
  Plane,
  Wallet,
  BarChart3,
  Settings,
  Download,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCasino } from "./context";
import { csvCell } from "@/lib/casino-request-schema";
import {
  casinos,
  requestTypes,
  statusPairs,
  type Pair,
} from "@/lib/casino-data";
const tabs: { id: string; title: Pair; icon: typeof Inbox }[] = [
  { id: "overview", title: ["Overview", "Επισκόπηση"], icon: LayoutDashboard },
  { id: "customers", title: ["Customers", "Πελάτες"], icon: Users },
  { id: "requests", title: ["Requests", "Αιτήματα"], icon: Inbox },
  {
    id: "partners",
    title: ["Casino partners", "Συνεργάτες καζίνο"],
    icon: Building2,
  },
  {
    id: "travel",
    title: ["Travel coordination", "Ταξιδιωτικός συντονισμός"],
    icon: Plane,
  },
  { id: "commissions", title: ["Commissions", "Προμήθειες"], icon: Wallet },
  { id: "reports", title: ["Reports", "Αναφορές"], icon: BarChart3 },
  { id: "settings", title: ["Settings", "Ρυθμίσεις"], icon: Settings },
];
export function Portal() {
  const { t, p, requests, setStatus } = useCasino();
  const [tab, setTab] = useState("overview");
  const [mode, setMode] = useState("admin");
  const [query, setQuery] = useState("");
  const [status, setFilterStatus] = useState("all");
  const [lookup, setLookup] = useState("");
  const [foundRef, setFoundRef] = useState("");
  const found = requests.find((record) => record.ref === foundRef);
  const [looked, setLooked] = useState(false);
  const filtered = requests.filter(
    (r) =>
      `${r.ref} ${r.name} ${r.surname} ${r.destination} ${r.customerId}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "all" || r.status === status),
  );
  function exportReport() {
    const rows = [
      [
        "reference",
        "customer_reference",
        "destination",
        "type",
        "status",
        "demo",
      ],
      ...requests.map((r) => [
        r.ref,
        r.customerId,
        r.destination,
        r.type,
        r.status,
        String(r.demo),
      ]),
    ];
    const blob = new Blob(
      [rows.map((row) => row.map(csvCell).join(",")).join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "casinobooking-demo-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="portal">
      <aside className="portal-sidebar">
        <h2>{t("Concierge workspace", "Χώρος συντονισμού")}</h2>
        <span className="demo-label">
          {t("DEMO · NOT ACCESS-PROTECTED", "DEMO · ΧΩΡΙΣ ΠΡΟΣΤΑΣΙΑ ΠΡΟΣΒΑΣΗΣ")}
        </span>
        <nav
          className="portal-nav"
          aria-label={t("Demo portal navigation", "Πλοήγηση πύλης επίδειξης")}
        >
          {tabs.map((s) => (
            <Button
              key={s.id}
              variant={tab === s.id ? "default" : "darkGhost"}
              onClick={() => {
                setTab(s.id);
                setMode("admin");
              }}
            >
              <s.icon />
              {p(s.title)}
            </Button>
          ))}
        </nav>
      </aside>
      <div className="portal-main">
        <div className="portal-heading">
          <div>
            <div className="eyebrow">
              {t(
                "CASINOBOOKING.COM · DEMO PORTAL",
                "CASINOBOOKING.COM · ΠΥΛΗ ΕΠΙΔΕΙΞΗΣ",
              )}
            </div>
            <h1>
              {mode === "customer"
                ? t("Your enquiry", "Το αίτημά σας")
                : p(tabs.find((s) => s.id === tab)?.title)}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={mode === "admin" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setMode("admin")}
            >
              {t("Admin demo", "Demo διαχειριστή")}
            </Button>
            <Button
              variant={mode === "customer" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setMode("customer")}
            >
              {t("Customer demo", "Demo πελάτη")}
            </Button>
          </div>
        </div>
        <div className="notice">
          {t(
            "DEMO MODE — sample records are fictional. Session enquiries are temporary. No real login, secure customer access, bookings, partner agreements or commission payments are configured. Production database/auth is still needed.",
            "ΛΕΙΤΟΥΡΓΙΑ DEMO — οι εγγραφές είναι φανταστικές. Τα αιτήματα συνεδρίας είναι προσωρινά. Δεν έχει ρυθμιστεί πραγματική σύνδεση, ασφαλής πρόσβαση, κρατήσεις, συμφωνίες ή πληρωμές προμηθειών. Απαιτείται πραγματική βάση/σύνδεση.",
          )}
        </div>
        {mode === "customer" ? (
          <div className="portal-customer">
            <h2 className="page-title">
              {t("Find a demo request", "Βρείτε αίτημα επίδειξης")}
            </h2>
            <p className="section-subtitle">
              {t(
                "Reference lookup is a prototype, not authentication. Use your session reference or CB-DEMO-001.",
                "Η αναζήτηση αναφοράς είναι πρωτότυπο, όχι ταυτοποίηση. Χρησιμοποιήστε αναφορά συνεδρίας ή CB-DEMO-001.",
              )}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFoundRef(lookup.trim().toUpperCase());
                setLooked(true);
              }}
            >
              <input
                aria-label={t("Request reference", "Αριθμός αναφοράς")}
                placeholder="CB-DEMO-001"
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                required
                maxLength={64}
              />
              <Button variant="secondary" type="submit">
                {t("Find enquiry", "Βρείτε αίτημα")}
                <ArrowRight />
              </Button>
            </form>
            {looked &&
              (found ? (
                <div className="notice">
                  <strong>{found.ref}</strong>
                  <p>{found.destination}</p>
                  <p>
                    {t("Status", "Κατάσταση")}: {p(statusPairs[found.status])}
                  </p>
                  <p>
                    {t("Customer reference", "Αναφορά πελάτη")}:{" "}
                    {found.customerId}
                  </p>
                </div>
              ) : (
                <p className="notice">
                  {t(
                    "No request found in this session.",
                    "Δεν βρέθηκε αίτημα σε αυτή τη συνεδρία.",
                  )}
                </p>
              ))}
          </div>
        ) : (
          <>
            {tab === "overview" && (
              <div className="kpis">
                {[
                  [t("Total enquiries", "Σύνολο αιτημάτων"), requests.length],
                  [
                    t("New requests", "Νέα αιτήματα"),
                    requests.filter((r) => r.status === "new").length,
                  ],
                  [
                    t("Directory candidates", "Υποψήφιοι καταλόγου"),
                    casinos.length,
                  ],
                  [t("Confirmed partners", "Επιβεβαιωμένοι συνεργάτες"), 0],
                ].map(([label, value]) => (
                  <div className="kpi" key={label}>
                    <p>{label}</p>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            )}
            {["overview", "requests", "customers", "travel"].includes(tab) && (
              <>
                <div className="filter-bar">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t(
                      "Search name, reference or destination…",
                      "Αναζήτηση ονόματος, αναφοράς ή προορισμού…",
                    )}
                    aria-label={t(
                      "Search demo records",
                      "Αναζήτηση εγγραφών demo",
                    )}
                  />
                  <select
                    aria-label={t("Request status filter", "Φίλτρο κατάστασης")}
                    value={status}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">
                      {t("All statuses", "Όλες οι καταστάσεις")}
                    </option>
                    {Object.entries(statusPairs).map(([k, v]) => (
                      <option key={k} value={k}>
                        {p(v)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          {t("Customer / reference", "Πελάτης / αναφορά")}
                        </th>
                        <th>{t("Destination", "Προορισμός")}</th>
                        <th>
                          {tab === "customers"
                            ? t("Contact / type", "Επικοινωνία / τύπος")
                            : t("Request / travel", "Αίτημα / ταξίδι")}
                        </th>
                        <th>{t("Status", "Κατάσταση")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr key={r.ref}>
                          <td>
                            {r.name} {r.surname}
                            <small>{r.customerId}</small>
                            <small>
                              {r.demo
                                ? t("DEMO SAMPLE", "ΔΕΙΓΜΑ DEMO")
                                : t("SESSION ENQUIRY", "ΑΙΤΗΜΑ ΣΥΝΕΔΡΙΑΣ")}
                            </small>
                          </td>
                          <td>
                            {r.destination}
                            <small>{r.ref}</small>
                          </td>
                          <td>
                            {tab === "customers"
                              ? r.email
                              : p(
                                  requestTypes[r.type] ||
                                    requestTypes["introduction"],
                                )}
                            <small>
                              {tab === "customers"
                                ? r.customerType === "individual"
                                  ? t("Individual", "Ιδιώτης")
                                  : t("Business", "Επιχείρηση")
                                : `${r.start} → ${r.end} · ${r.party} ${t("adults", "ενήλικες")}`}
                            </small>
                          </td>
                          <td>
                            <select
                              value={r.status}
                              onChange={(e) => setStatus(r.ref, e.target.value)}
                              aria-label={`${t("Status for", "Κατάσταση για")} ${r.ref}`}
                            >
                              {Object.entries(statusPairs).map(([k, v]) => (
                                <option key={k} value={k}>
                                  {p(v)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="empty">
                      {t("No matching records", "Δεν βρέθηκαν εγγραφές")}
                    </div>
                  )}
                </div>
              </>
            )}
            {tab === "partners" && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{t("Directory candidate", "Υποψήφιος καταλόγου")}</th>
                      <th>
                        {t("Partnership status", "Κατάσταση συνεργασίας")}
                      </th>
                      <th>{t("Agreement", "Συμφωνία")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casinos.map((c) => (
                      <tr key={c.id}>
                        <td>
                          {c.name}
                          <small>{p(c.city)}</small>
                          <small>
                            {t(
                              "Verify local law/licensing before travel",
                              "Ελέγξτε τοπικούς νόμους/άδειες πριν ταξιδέψετε",
                            )}
                          </small>
                        </td>
                        <td>
                          {t("Not yet confirmed", "Δεν έχει επιβεβαιωθεί")}
                        </td>
                        <td>
                          {t(
                            "No signed agreement",
                            "Χωρίς υπογεγραμμένη συμφωνία",
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === "commissions" && (
              <>
                <div className="kpis">
                  <div className="kpi">
                    <p>
                      {t("Confirmed commissions", "Επιβεβαιωμένες προμήθειες")}
                    </p>
                    <strong>0</strong>
                  </div>
                  <div className="kpi">
                    <p>{t("Signed agreements", "Υπογεγραμμένες συμφωνίες")}</p>
                    <strong>0</strong>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          {t("Illustrative record", "Ενδεικτική εγγραφή")}
                        </th>
                        <th>{t("Status", "Κατάσταση")}</th>
                        <th>{t("Amount", "Ποσό")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          COM-DEMO-001
                          <small>
                            {t(
                              "Fictional workflow only",
                              "Μόνο φανταστική ροή",
                            )}
                          </small>
                        </td>
                        <td>
                          {t("Agreement required", "Απαιτείται συμφωνία")}
                        </td>
                        <td>{t("Not agreed", "Δεν έχει συμφωνηθεί")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {tab === "reports" && (
              <>
                <h2 className="page-title">
                  {t(
                    "Session activity report",
                    "Αναφορά δραστηριότητας συνεδρίας",
                  )}
                </h2>
                <p className="section-subtitle">
                  {t(
                    "Export the current demo request references and statuses. No revenue or real performance is implied.",
                    "Εξαγωγή τρεχουσών αναφορών και καταστάσεων demo. Δεν υπονοούνται έσοδα ή πραγματική απόδοση.",
                  )}
                </p>
                <Button
                  className="mt-6"
                  variant="secondary"
                  onClick={exportReport}
                >
                  <Download />
                  {t("Export demo CSV", "Εξαγωγή CSV demo")}
                </Button>
              </>
            )}
            {tab === "settings" && (
              <div className="prose-copy">
                <h2>{t("Production readiness", "Ετοιμότητα παραγωγής")}</h2>
                <p>
                  {t(
                    "Authentication: not configured. Database: not connected. Role-based permissions: not active. Contact delivery: not configured. This page is a demo, not a security administration screen.",
                    "Σύνδεση: δεν έχει ρυθμιστεί. Βάση: δεν έχει συνδεθεί. Δικαιώματα ρόλων: μη ενεργά. Αποστολή επικοινωνίας: μη ρυθμισμένη. Είναι επίδειξη, όχι οθόνη διαχείρισης ασφάλειας.",
                  )}
                </p>
                <h2>{t("Security recommendations", "Συστάσεις ασφάλειας")}</h2>
                <p>
                  {t(
                    "Require HTTPS/TLS, administrator multi-factor authentication, least-privilege access, validated inputs and privacy-reviewed audit logs. Set retention and deletion rules; test backups and recovery. No system is guaranteed 100% secure.",
                    "Απαιτούνται HTTPS/TLS, έλεγχος πολλαπλών παραγόντων για διαχειριστές, ελάχιστα δικαιώματα, έλεγχος εισόδων και καταγραφές με σεβασμό στο απόρρητο. Ορίστε κανόνες διατήρησης/διαγραφής και ελέγξτε αντίγραφα ασφαλείας και ανάκτηση. Κανένα σύστημα δεν είναι εγγυημένα 100% ασφαλές.",
                  )}
                </p>
                <h2>
                  {t("Before real operation", "Πριν από πραγματική λειτουργία")}
                </h2>
                <p>
                  {t(
                    "Enable Lovable Cloud; configure profiles, requests, casino partners, travel requests and commission records with separate roles and least-privilege access. Apply privacy retention rules and complete legal/provider reviews before collecting real data.",
                    "Ενεργοποιήστε Lovable Cloud· ρυθμίστε προφίλ, αιτήματα, συνεργάτες, ταξιδιωτικά αιτήματα και προμήθειες με ξεχωριστούς ρόλους και ελάχιστα δικαιώματα. Εφαρμόστε κανόνες διατήρησης και ολοκληρώστε νομικούς ελέγχους πριν συλλέξετε πραγματικά δεδομένα.",
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
