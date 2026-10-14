import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCasino } from "@/components/casino/context";
import { useAuth } from "@/components/casino/auth";
import { fetchEnquiries, fetchProfilesByIds } from "@/lib/enquiry-db";
import { requestTypes, statusPairs } from "@/lib/casino-data";
import { casinoHead } from "@/lib/casino-seo";
import { AdminEnquiryDetails } from "@/components/casino/admin-details";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => casinoHead("Admin CRM", "Administrator-only enquiry management for CasinoBooking.com."),
  component: Admin,
});

function Admin() {
  const { t, p } = useCasino();
  const { isAdmin, session } = useAuth();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const enquiries = useQuery({ queryKey: ["enquiries", "admin"], queryFn: fetchEnquiries, enabled: isAdmin });
  const ids = [...new Set((enquiries.data ?? []).map((e) => e.user_id))];
  const profiles = useQuery({
    queryKey: ["profiles", ids],
    queryFn: () => fetchProfilesByIds(ids),
    enabled: isAdmin && ids.length > 0,
  });
  const refOf = (uid: string) => profiles.data?.find((x) => x.id === uid)?.customer_ref ?? "—";

  if (!isAdmin) {
    return (
      <main className="section">
        <div className="container">
          <h1 className="page-title">{t("Access restricted", "Περιορισμένη πρόσβαση")}</h1>
          <p className="section-subtitle">
            {t(
              "This area is for administrators only. Access is enforced by the database, not only this screen.",
              "Η περιοχή είναι μόνο για διαχειριστές. Η πρόσβαση επιβάλλεται από τη βάση δεδομένων, όχι μόνο από αυτή την οθόνη.",
            )}
          </p>
        </div>
      </main>
    );
  }

  const rows = (enquiries.data ?? []).filter(
    (e) =>
      `${e.ref} ${e.name} ${e.surname} ${e.email} ${e.destination} ${refOf(e.user_id)}`
        .toLowerCase()
        .includes(query.toLowerCase()) && (status === "all" || e.status === status),
  );

  async function changeStatus(id: string, next: string) {
    const { error } = await supabase.from("enquiries").update({ status: next }).eq("id", id);
    if (error) toast.error(t("Status update failed", "Η ενημέρωση απέτυχε"));
    else {
      toast.success(t("Status updated", "Η κατάσταση ενημερώθηκε"));
      qc.invalidateQueries({ queryKey: ["enquiries"] });
    }
  }

  return (
    <main className="section" style={{background:"linear-gradient(180deg,#f8f5f0,#fff)",minHeight:"95vh"}}>
      <div className="container">
        <div className="eyebrow">{t("ADMIN CRM · ADMINISTRATORS ONLY", "CRM · ΜΟΝΟ ΔΙΑΧΕΙΡΙΣΤΕΣ")}</div>
        <h1 className="page-title">{t("Enquiry requests", "Αιτήματα")}</h1>
        <p className="section-subtitle">
          {t("Signed in as", "Συνδεδεμένος ως")} {session?.user.email} ·{" "}
          {t("Total", "Σύνολο")}: {enquiries.data?.length ?? 0} · {t("New", "Νέα")}:{" "}
          {enquiries.data?.filter((e) => e.status === "new").length ?? 0}
        </p>
        <div className="notice">
          {t(
            "Travel enquiries only — no booking, partnership or commission is confirmed. Customers are not notified automatically; email/WhatsApp delivery is not connected.",
            "Μόνο ταξιδιωτικά αιτήματα — καμία κράτηση, συνεργασία ή προμήθεια δεν επιβεβαιώνεται. Οι πελάτες δεν ειδοποιούνται αυτόματα· η αποστολή email/WhatsApp δεν έχει συνδεθεί.",
          )}
        </div>
        <div className="filter-bar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search name, reference or destination…", "Αναζήτηση ονόματος, αναφοράς ή προορισμού…")}
            aria-label={t("Search enquiries", "Αναζήτηση αιτημάτων")}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label={t("Status filter", "Φίλτρο κατάστασης")}>
            <option value="all">{t("All statuses", "Όλες οι καταστάσεις")}</option>
            {Object.entries(statusPairs).map(([k, v]) => (
              <option key={k} value={k}>{p(v)}</option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("Customer / reference", "Πελάτης / αναφορά")}</th>
                <th>{t("Contact", "Επικοινωνία")}</th>
                <th>{t("Request / travel", "Αίτημα / ταξίδι")}</th>
                <th>{t("Status", "Κατάσταση")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.name} {e.surname}
                    <small>{refOf(e.user_id)}</small>
                    <small>{e.ref}</small>
                  </td>
                  <td>
                    {e.email}
                    <small>{e.phone} · {e.preference}</small>
                    <small>{e.residence} · {e.customer_type === "business" ? t("Business", "Επιχείρηση") : t("Individual", "Ιδιώτης")}</small>
                  </td>
                  <td>
                    {e.destination}
                    <small>{p(requestTypes[e.request_type])}</small>
                    <small>{e.start_date} → {e.end_date} · {e.party} {t("adults", "ενήλικες")}</small>
                    <small>{(e.services || []).join(" · ")}</small>
                    {e.casino_name && <small>{t("Casino","Καζίνο")}: {e.casino_name}</small>}
                    {e.company_name && <small>{t("Company","Εταιρεία")}: {e.company_name}</small>}
                    {e.message && <small>{e.message}</small>}
                  </td>
                  <td>
                    <button type="button" style={{background:"#e4b56f",color:"#092038",padding:"6px 10px",borderRadius:6,fontWeight:700,display:"block",marginBottom:8}}
                      onClick={()=>setSelectedId(selectedId===e.id?null:e.id)} aria-expanded={selectedId===e.id}>
                      {selectedId===e.id?t("Close file","Κλείσιμο καρτέλας"):t("Open customer file","Άνοιγμα καρτέλας")}
                    </button>
                    <select value={e.status} onChange={(ev) => changeStatus(e.id, ev.target.value)} aria-label={`${t("Status for", "Κατάσταση για")} ${e.ref}`}>
                      {Object.entries(statusPairs).map(([k, v]) => (
                        <option key={k} value={k}>{p(v)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {enquiries.isSuccess && rows.length === 0 && <div className="empty">{t("No matching records", "Δεν βρέθηκαν εγγραφές")}</div>}
        </div>
        {selectedId && (()=>{const current=(enquiries.data||[]).find(e=>e.id===selectedId);
          return current?<AdminEnquiryDetails enquiry={current} customerRef={refOf(current.user_id)}/>:null;})()}
        {enquiries.isError && <p role="alert">{t("Could not load CRM enquiries.","Αδυναμία φόρτωσης αιτημάτων CRM.")}</p>}
      </div>
    </main>
  );
}