import { useState, type CSSProperties } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCasino } from "./context";
import { useAuth } from "./auth";
import type { Enquiry } from "@/lib/enquiry-db";
import { toast } from "sonner";

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
  const { t } = useCasino();
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
    queryKey: ["crm-notes", key],
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
    queryKey: ["crm-tasks", key],
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
    queryKey: ["crm-segments", key],
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
  const history = useQuery({
    queryKey: ["crm-history", key],
    enabled: isAdmin,
    queryFn: async () => {
      const r = await supabase
        .from("enquiry_status_events")
        .select("*")
        .eq("enquiry_id", key)
        .order("changed_at", { ascending: false });
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
    op: () => PromiseLike<{ error: { message: string } | null }>,
    queryKey: string,
    clear: () => void,
  ) {
    setSaving(true);
    try {
      const { error } = await op();
      if (error) throw new Error(error.message);
      clear();
      await qc.invalidateQueries({ queryKey: [queryKey, key] });
      toast.success(t("Saved to CRM", "Αποθηκεύτηκε στο CRM"));
    } catch (e) {
      toast.error(t("Could not save the record", "Αδυναμία αποθήκευσης"));
    } finally {
      setSaving(false);
    }
  }
  return (
    <section
      style={{ marginTop: 24, display: "grid", gap: 16 }}
      aria-label="Customer request details"
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
          {t("Customer file", "Καρτέλα πελάτη")} · {customerRef}
        </h2>
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
            <strong>{enquiry.services?.join(" · ") || "—"}</strong>
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
        {segments.data?.map((s) => (
          <p
            key={s.id}
            style={{ padding: "9px 0", borderBottom: "1px solid #e2e8f0" }}
          >
            <strong>{s.service_kind}</strong> · {s.summary}{" "}
            <span style={{ color: "#957038" }}>({s.status})</span>
          </p>
        ))}
        {segments.isError && (
          <p role="alert">
            {t("Unable to load itinerary", "Αδυναμία φόρτωσης προγράμματος")}
          </p>
        )}
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 15 }}
        >
          <select
            value={segmentKind}
            onChange={(e) =>
              setSegmentKind(e.target.value as typeof segmentKind)
            }
            aria-label="Service kind"
          >
            {kinds.map((k) => (
              <option value={k} key={k}>
                {k}
              </option>
            ))}
          </select>
          <input
            style={{ flex: 1, minWidth: 240 }}
            value={segmentSummary}
            maxLength={240}
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
                  supabase.from("itinerary_segments").insert({
                    enquiry_id: key,
                    service_kind: segmentKind,
                    summary: segmentSummary.trim(),
                  }),
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
                  supabase.from("crm_notes").insert({
                    enquiry_id: key,
                    author_id: session.user.id,
                    body: noteDraft.trim(),
                  }),
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
          {tasks.data?.map((task) => (
            <p
              key={task.id}
              style={{ borderBottom: "1px solid #e2e8f0", padding: "10px 0" }}
            >
              {task.title} · <strong>{task.status}</strong>
            </p>
          ))}
          <input
            style={{ width: "100%", margin: "10px 0" }}
            value={taskDraft}
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
                    .insert({ enquiry_id: key, title: taskDraft.trim() }),
                "crm-tasks",
                () => setTaskDraft(""),
              )
            }
          >
            {t("Add task", "Νέα εργασία")}
          </button>
        </div>
      </div>
      <div style={card}>
        <h3 style={head}>
          {t("Request status history", "Ιστορικό κατάστασης αιτήματος")}
        </h3>
        {history.data?.map((h) => (
          <p key={h.id} style={{ margin: "6px 0" }}>
            {new Date(h.changed_at).toLocaleString()} · {h.old_status || "—"} →{" "}
            <strong>{h.new_status}</strong>
          </p>
        ))}
        {history.isError && (
          <p role="alert">
            {t("History unavailable", "Το ιστορικό δεν είναι διαθέσιμο")}
          </p>
        )}
      </div>
      <p style={{ fontSize: 12, color: "#64748b" }}>
        {t(
          "CRM planning only. Supplier bookings, email and WhatsApp deliveries are not activated.",
          "Μόνο για σχεδιασμό CRM. Δεν έχουν ενεργοποιηθεί κρατήσεις παρόχων ούτε αποστολές email/WhatsApp.",
        )}
      </p>
    </section>
  );
}
