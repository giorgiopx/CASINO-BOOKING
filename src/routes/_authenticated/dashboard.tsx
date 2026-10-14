import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCasino } from "@/components/casino/context";
import { useAuth } from "@/components/casino/auth";
import { fetchEnquiries, fetchMyProfile } from "@/lib/enquiry-db";
import { requestTypes, statusPairs } from "@/lib/casino-data";
import { casinoHead } from "@/lib/casino-seo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () =>
    casinoHead("My enquiries", "Your CasinoBooking.com customer reference and travel enquiry status."),
  component: Dashboard,
});

function Dashboard() {
  const { t, p } = useCasino();
  const { session, isAdmin, signOut } = useAuth();
  const userId = session?.user.id ?? "";
  const profile = useQuery({ queryKey: ["profile", userId], queryFn: () => fetchMyProfile(userId), enabled: !!userId });
  const enquiries = useQuery({ queryKey: ["enquiries", "mine", userId], queryFn: fetchEnquiries, enabled: !!userId });
  const mine = (enquiries.data ?? []).filter((e) => e.user_id === userId);

  return (
    <main className="section">
      <div className="container">
        <div className="eyebrow">{t("MY ACCOUNT", "Ο ΛΟΓΑΡΙΑΣΜΟΣ ΜΟΥ")}</div>
        <h1 className="page-title">{t("Your travel enquiries", "Τα ταξιδιωτικά σας αιτήματα")}</h1>
        <p className="section-subtitle">
          {t("Customer reference", "Αναφορά πελάτη")}:{" "}
          <strong data-testid="customer-ref">{profile.data?.customer_ref ?? "…"}</strong> · {session?.user.email}
        </p>
        <div className="notice">
          {t(
            "These are travel enquiries, not confirmed bookings. No partnership, availability or price is confirmed. Email and WhatsApp notifications are not yet connected — check this page for status updates.",
            "Πρόκειται για ταξιδιωτικά αιτήματα, όχι επιβεβαιωμένες κρατήσεις. Δεν επιβεβαιώνεται συνεργασία, διαθεσιμότητα ή τιμή. Οι ειδοποιήσεις email και WhatsApp δεν έχουν συνδεθεί ακόμη — ελέγχετε αυτή τη σελίδα για ενημερώσεις.",
          )}
        </div>
        <div className="flex gap-3 flex-wrap my-6">
          <Button asChild variant="secondary">
            <Link to="/request">
              {t("New enquiry", "Νέο αίτημα")} <ArrowRight />
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline">
              <Link to="/admin">{t("Admin CRM", "CRM διαχειριστή")}</Link>
            </Button>
          )}
          <Button variant="outline" onClick={signOut}>
            {t("Sign out", "Αποσύνδεση")}
          </Button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("Reference", "Αναφορά")}</th>
                <th>{t("Destination", "Προορισμός")}</th>
                <th>{t("Request / travel", "Αίτημα / ταξίδι")}</th>
                <th>{t("Status", "Κατάσταση")}</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong>{e.ref}</strong>
                    <small>{new Date(e.created_at).toLocaleDateString()}</small>
                  </td>
                  <td>{e.destination}</td>
                  <td>
                    {p(requestTypes[e.request_type])}
                    <small>
                      {e.start_date} → {e.end_date} · {e.party} {t("adults", "ενήλικες")}
                    </small>
                  </td>
                  <td>{p(statusPairs[e.status])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {enquiries.isLoading && <div className="empty">{t("Loading…", "Φόρτωση…")}</div>}
          {enquiries.isError && <div className="empty">{t("Could not load enquiries.", "Αδυναμία φόρτωσης αιτημάτων.")}</div>}
          {enquiries.isSuccess && mine.length === 0 && (
            <div className="empty">{t("No enquiries yet.", "Δεν υπάρχουν αιτήματα ακόμη.")}</div>
          )}
        </div>
      </div>
    </main>
  );
}