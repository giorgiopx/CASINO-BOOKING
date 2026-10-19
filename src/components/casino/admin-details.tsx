import { useState, type CSSProperties } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCasino } from "./context";
import { useAuth } from "./auth";
import type { Enquiry } from "@/lib/enquiry-db";
import { toast } from "sonner";
import { EnquiryHistory } from "./crm-ui";
import { serviceLabels } from "@/lib/crm-display";

const kinds = [
  "casino",
  "flight",
  "hotel",
  "transfer",
  "cruise",
  "package",
] as const;
const card: CSSProperties = {
  border: "1px solid #d8c49a",
  borderRadius: 12,
  padding: 20,
  background: "#ffffff",
  boxShadow: "0 2px 8px #001c3012",
};
const head: CSSProperties = {
  color: "#092239",
  fontFamily: "Georgia,serif",
  fontSize: 24,
  fontWeight: 500,
};
const button: CSSProperties = {
  background: "#d9ac68",
  color: "#082039",
  fontWeight: 700,
  padding: "9px 18px",
  border: 0,
  borderRadius: 8,
  cursor: "pointer",
};
export function AdminEnquiryDetails({
  enquiry,
  customerRef,
}: {
  enquiry: Enquiry;
  customerRef: string;
}) {
  const { t, p } = useCasino();
  const { session, isAdmin } = useAuth();
  const qc = useQueryClient();
  const [noteDraft, setNoteDraft] = useState("");
  const [taskDraft, setTaskDraft] = useState("");
  const [segmentKind, setSegmentKind] =
    useState<(typeof kinds)[number]>("flight");
  const [segmentSummary, setSegmentSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const key = enquiry.id;
  const notes = useQuery({
    queryKey: ["crm-notes", key, session?.user.id],
    enabled: isAdmin,
    queryFn: async () => {
      const r = await supabase
        .from("crm_notes")
        .select("*")
        .eq("enquiry_id", key)
        .order("created_at", { ascending: false });
      if (r.error) throw r.error;
      return r.data;
    },
  });
  const tasks = useQuery({
    queryKey: ["crm-tasks", key, session?.user.id],
    enabled: isAdmin,
    queryFn: async () => {
      const r = await supabase
        .from("crm_tasks")
        .select("*")
        .eq("enquiry_id", key)
        .order("created_at", { ascending: false });
      if (r.error) throw r.error;
      return r.data;
    },
  });
  const segments = useQuery({
    queryKey: ["crm-segments", key, session?.user.id],
    enabled: isAdmin,
    queryFn: async () => {
      const r = await supabase
        .from("itinerary_segments")
        .select("*")
        .eq("enquiry_id", key)
        .order("created_at", { ascending: true });
      if (r.error) throw r.error;
      return r.data;
    },
  });
  if (!isAdmin || !session) return null;
  const prefs =
    enquiry.trip_preferences &&
    typeof enquiry.trip_preferences === "object" &&
    !Array.isArray(enquiry.trip_preferences)
      ? Object.entries(enquiry.trip_preferences).filter(
          ([, v]) => typeof v === "string" && v.length > 0,
        )
      : [];
  async function run(
    op: () => PromiseLike<{ data: unknown; error: { message: string } | null }>,
    queryKey: string,
    clear: () => void,
  ) {
    if (saving) return;
    setSaving(true);
    try {
      const { data, error } = await op();
      if (error || !data) throw new Error(error?.message || "No saved record");
      clear();
      try {
        await qc.invalidateQueries(
          { queryKey: [queryKey, key, session?.user.id], exact: true },
          { throwOnError: true },
        );
        toast.success(t("Saved to CRM", "Αποθηκεύτηκε στο CRM"));
      } catch {
        toast.warning(
          t(
            "Saved to CRM, but the list could not refresh. Retry loading the list; do not submit the same record again.",
            "Αποθηκεύτηκε στο CRM, αλλά η λίστα δεν ανανεώθηκε. Δοκιμάστε ξανά τη φόρτωση· μην υποβάλετε την ίδια εγγραφή ξανά.",
          ),
        );
      }
    } catch {
      toast.error(t("Could not save the record", "Αδυναμία αποθήκευσης"));
    } finally {
      setSaving(false);
    }
  }
  return (
    <section
      style={{ marginTop: 24, display: "grid", gap: 16 }}
      aria-label={t(
        "Customer request details",
        "Λεπτομέρειες αιτήματος πελάτη",
      )}
    >
      <div
        style={{
          background: "#061b2f",
          color: "#fff",
          padding: 24,
          borderRadius: 14,
          border: "1px solid #ca9a5a",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 28,
            color: "#e7bc76",
            marginBottom: 10,
          }}
        >
          {t("Enquiry file", "Καρτέλα αιτήματος")} · {enquiry.ref}
        </h2>
        <p style={{ marginBottom: 16 }}>
          {t("Customer ID", "Κωδικός πελάτη")}: {customerRef} ·{" "}
          {enquiry.customer_type === "business"
            ? t("Company", "Εταιρεία")
            : t("Individual", "Ιδιώτης")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
            gap: 16,
            fontSize: 14,
          }}
        >
          <div>
            <small>{t("Enquiry", "Αίτημα")}</small>
            <br />
            <strong>{enquiry.ref}</strong>
          </div>
          <div>
            <small>{t("Customer", "Πελάτης")}</small>
            <br />
            <strong>
              {enquiry.name} {enquiry.surname}
            </strong>
          </div>
          <div>
            <small>{t("Company", "Εταιρεία")}</small>
            <br />
            <strong>{enquiry.company_name || "—"}</strong>
          </div>
          <div>
            <small>{t("Destination / casino", "Προορισμός / καζίνο")}</small>
            <br />
            <strong>
              {enquiry.destination} · {enquiry.casino_name || "—"}
            </strong>
          </div>
          <div>
            <small>{t("Travel dates", "Ημερομηνίες")}</small>
            <br />
            <strong>
              {enquiry.start_date} → {enquiry.end_date}
            </strong>
          </div>
          <div>
            <small>{t("Travelers", "Ταξιδιώτες")}</small>
            <br />
            <strong>{enquiry.party}</strong>
          </div>
          <div>
            <small>{t("Services", "Υπηρεσίες")}</small>
            <br />
            <strong>
              {enquiry.services
                ?.map((kind) => p(serviceLabels[kind]) || kind)
                .join(" · ") || "—"}
            </strong>
          </div>
          <div>
            <small>{t("Contact", "Επικοινωνία")}</small>
            <br />
            <strong>
              {enquiry.email}
              <br />
              {enquiry.phone}
            </strong>
          </div>
        </div>
        {enquiry.message && (
          <p style={{ marginTop: 18, fontSize: 14 }}>{enquiry.message}</p>
        )}
      </div>
      <div style={card}>
        <h3 style={head}>
          {t(
            "Flight, hotel & transfer preferences",
            "Προτιμήσεις πτήσεων, διαμονής και transfer",
          )}
        </h3>
        {prefs.length === 0 ? (
          <p>—</p>
        ) : (
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 8,
              marginTop: 14,
            }}
          >
            {prefs.map(([k, v]) => (
              <div key={k}>
                <dt style={{ fontSize: 11, color: "#64748b" }}>
                  {k.replace(/([A-Z])/g, " $1")}
                </dt>
                <dd style={{ fontWeight: 600 }}>{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div style={card}>
        <h3 style={head}>
          {t("Itinerary coordination", "Συντονισμός ταξιδιού")}
        </h3>
        {segments.isPending && <p role="status">{t("Loading…", "Φόρτωση…")}</p>}
        {segments.isError && (
          <p role="alert">
            {t("Could not load these records.", "Αδυναμία φόρτωσης εγγραφών.")}{" "}
            <button
              type="button"
              className="crm-text-button"
              onClick={() => void segments.refetch()}
            >
              {t("Try again", "Δοκιμάστε ξανά")}
            </button>
          </p>
        )}
        {segments.isSuccess && segments.data.length === 0 && (
          <p className="crm-help">
            {t("No records yet.", "Δεν υπάρχουν εγγραφές ακόμη.")}
          </p>
        )}
        {segments.data?.map((s) => (
          <p
            key={s.id}
            style={{ padding: "9px 0", borderBottom: "1px solid #e2e8f0" }}
          >
            <strong>
              {p(serviceLabels[s.service_kind]) || s.service_kind}
            </strong>{" "}
            · {s.summary} <span style={{ color: "#957038" }}>({s.status})</span>
          </p>
        ))}
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 15 }}
        >
          <select
            value={segmentKind}
            onChange={(e) =>
              setSegmentKind(e.target.value as typeof segmentKind)
            }
            aria-label={t("Service kind", "Είδος υπηρεσίας")}
          >
            {kinds.map((k) => (
              <option value={k} key={k}>
                {p(serviceLabels[k])}
              </option>
            ))}
          </select>
          <input
            style={{ flex: 1, minWidth: 240 }}
            value={segmentSummary}
            maxLength={240}
            aria-label={t("Itinerary proposal", "Πρόταση προγράμματος")}
            onChange={(e) => setSegmentSummary(e.target.value)}
            placeholder={t(
              "Plan / proposal (not a confirmed booking)",
              "Πρόταση / πρόγραμμα (όχι επιβεβαιωμένη κράτηση)",
            )}
          />
          <button
            type="button"
            style={button}
            disabled={saving || !segmentSummary.trim()}
            onClick={() =>
              void run(
                () =>
                  supabase
                    .from("itinerary_segments")
                    .insert({
                      enquiry_id: key,
                      service_kind: segmentKind,
                      summary: segmentSummary.trim(),
                    })
                    .select("id")
                    .single(),
                "crm-segments",
                () => setSegmentSummary(""),
              )
            }
          >
            {t("Add segment", "Προσθήκη")}
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
        }}
      >
        <div style={card}>
          <h3 style={head}>
            {t(
              "Internal notes · admin only",
              "Εσωτερικές σημειώσεις · μόνο admin",
            )}
          </h3>
          {notes.isPending && <p role="status">{t("Loading…", "Φόρτωση…")}</p>}
          {notes.isError && (
            <p role="alert">
              {t(
                "Could not load these records.",
                "Αδυναμία φόρτωσης εγγραφών.",
              )}{" "}
              <button
                type="button"
                className="crm-text-button"
                onClick={() => void notes.refetch()}
              >
                {t("Try again", "Δοκιμάστε ξανά")}
              </button>
            </p>
          )}
          {notes.isSuccess && notes.data.length === 0 && (
            <p className="crm-help">
              {t("No records yet.", "Δεν υπάρχουν εγγραφές ακόμη.")}
            </p>
          )}
          {notes.data?.map((n) => (
            <p
              key={n.id}
              style={{ borderBottom: "1px solid #e2e8f0", padding: "10px 0" }}
            >
              {n.body}
              <small style={{ display: "block", color: "#64748b" }}>
                {new Date(n.created_at).toLocaleString()}
              </small>
            </p>
          ))}
          <textarea
            style={{ width: "100%", marginTop: 10 }}
            rows={3}
            maxLength={2000}
            aria-label={t(
              "Internal customer note",
              "Εσωτερική σημείωση πελάτη",
            )}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder={t(
              "Internal customer note",
              "Εσωτερική σημείωση πελάτη",
            )}
          />
          <button
            type="button"
            style={button}
            disabled={saving || !noteDraft.trim()}
            onClick={() =>
              void run(
                () =>
                  supabase
                    .from("crm_notes")
                    .insert({
                      enquiry_id: key,
                      author_id: session.user.id,
                      body: noteDraft.trim(),
                    })
                    .select("id")
                    .single(),
                "crm-notes",
                () => setNoteDraft(""),
              )
            }
          >
            {t("Save note", "Αποθήκευση")}
          </button>
        </div>
        <div style={card}>
          <h3 style={head}>
            {t("Team follow-up tasks", "Εργασίες παρακολούθησης")}
          </h3>
          {tasks.isPending && <p role="status">{t("Loading…", "Φόρτωση…")}</p>}
          {tasks.isError && (
            <p role="alert">
              {t(
                "Could not load these records.",
                "Αδυναμία φόρτωσης εγγραφών.",
              )}{" "}
              <button
                type="button"
                className="crm-text-button"
                onClick={() => void tasks.refetch()}
              >
                {t("Try again", "Δοκιμάστε ξανά")}
              </button>
            </p>
          )}
          {tasks.isSuccess && tasks.data.length === 0 && (
            <p className="crm-help">
              {t("No records yet.", "Δεν υπάρχουν εγγραφές ακόμη.")}
            </p>
          )}
          {tasks.data?.map((task) => (
            <p
              key={task.id}
              style={{ borderBottom: "1px solid #e2e8f0", padding: "10px 0" }}
            >
              {task.title}
              <select
                aria-label={`${t("Task status", "Κατάσταση εργασίας")}: ${task.title}`}
                value={task.status}
                disabled={saving}
                onChange={(event) =>
                  void run(
                    () =>
                      supabase
                        .from("crm_tasks")
                        .update({ status: event.target.value })
                        .eq("id", task.id)
                        .eq("enquiry_id", key)
                        .select("id")
                        .single(),
                    "crm-tasks",
                    () => {},
                  )
                }
              >
                <option value="open">{t("Open", "Ανοιχτή")}</option>
                <option value="in_progress">
                  {t("In progress", "Σε εξέλιξη")}
                </option>
                <option value="done">{t("Done", "Ολοκληρωμένη")}</option>
                <option value="cancelled">{t("Cancelled", "Ακυρωμένη")}</option>
              </select>
            </p>
          ))}
          <input
            style={{ width: "100%", margin: "10px 0" }}
            value={taskDraft}
            aria-label={t("Follow-up task", "Εργασία παρακολούθησης")}
            maxLength={240}
            onChange={(e) => setTaskDraft(e.target.value)}
            placeholder={t(
              "Example: Contact the hotel",
              "Π.χ. Επικοινωνία με ξενοδοχείο",
            )}
          />
          <button
            type="button"
            style={button}
            disabled={saving || !taskDraft.trim()}
            onClick={() =>
              void run(
                () =>
                  supabase
                    .from("crm_tasks")
                    .insert({ enquiry_id: key, title: taskDraft.trim() })
                    .select("id")
                    .single(),
                "crm-tasks",
                () => setTaskDraft(""),
              )
            }
          >
            {t("Add task", "Νέα εργασία")}
          </button>
        </div>
      </div>
      <EnquiryHistory enquiryId={key} />
      <p style={{ fontSize: 12, color: "#64748b" }}>
        {t(
          "CRM planning only. Supplier bookings, email and WhatsApp deliveries are not activated.",
          "Μόνο για σχεδιασμό CRM. Δεν έχουν ενεργοποιηθεί κρατήσεις παρόχων ούτε αποστολές email/WhatsApp.",
        )}
      </p>
    </section>
  );
}
