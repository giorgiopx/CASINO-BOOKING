import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCasino } from "@/components/casino/context";
import { useAuth } from "@/components/casino/auth";
import {
  fetchMyEnquiries,
  fetchMyProfile,
  CRM_PAGE_SIZE,
} from "@/lib/enquiry-db";
import { requestTypes, statusPairs } from "@/lib/casino-data";
import { casinoHead } from "@/lib/casino-seo";
import { CustomerProfileEditor } from "@/components/casino/profile-editor";
import { EnquiryHistory } from "@/components/casino/crm-ui";
import { serviceLabels } from "@/lib/crm-display";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () =>
    casinoHead(
      "My enquiries",
      "Your CasinoBooking.com customer reference and travel enquiry status.",
    ),
  component: Dashboard,
});

function Dashboard() {
  const { t, p } = useCasino();
  const { session, isAdmin, signOut } = useAuth();
  const userId = session?.user.id ?? "";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const profile = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchMyProfile(userId),
    enabled: !!userId,
  });
  const enquiries = useInfiniteQuery({
    queryKey: ["enquiries", "mine", userId],
    queryFn: ({ pageParam }) => fetchMyEnquiries(userId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === CRM_PAGE_SIZE ? pages.length : undefined,
    enabled: !!userId,
  });
  const mine = (enquiries.data?.pages.flat() ?? []).filter(
    (e) => e.user_id === userId,
  );

  return (
    <main className="section">
      <div className="container">
        <div className="eyebrow">{t("MY ACCOUNT", "Ο ΛΟΓΑΡΙΑΣΜΟΣ ΜΟΥ")}</div>
        <h1 className="page-title">
          {t("Your travel enquiries", "Τα ταξιδιωτικά σας αιτήματα")}
        </h1>
        <p className="section-subtitle">
          {t("Customer reference", "Αναφορά πελάτη")}:{" "}
          <strong data-testid="customer-ref">
            {profile.data?.customer_ref ?? "…"}
          </strong>{" "}
          · {session?.user.email}
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
        {profile.isPending && (
          <p role="status">
            {t("Loading your customer card…", "Φόρτωση καρτέλας πελάτη…")}
          </p>
        )}
        {profile.isError && (
          <p role="alert" className="crm-error">
            {t(
              "Could not load your customer card.",
              "Αδυναμία φόρτωσης καρτέλας πελάτη.",
            )}{" "}
            <button
              type="button"
              className="crm-text-button"
              onClick={() => void profile.refetch()}
            >
              {t("Try again", "Δοκιμάστε ξανά")}
            </button>
          </p>
        )}
        {profile.isSuccess && !profile.data && (
          <p role="alert" className="crm-error">
            {t(
              "Your customer card is not available. Please contact the team.",
              "Η καρτέλα σας δεν είναι διαθέσιμη. Επικοινωνήστε με την ομάδα.",
            )}
          </p>
        )}
        <CustomerProfileEditor profile={profile.data} />
        <h2
          style={{
            margin: "30px 0 16px",
            fontSize: 26,
            fontFamily: "Georgia, serif",
          }}
        >
          {t("My enquiry history", "Το ιστορικό αιτημάτων μου")}
        </h2>
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
                  <td>
                    <strong>{e.destination}</strong>
                    {e.casino_name && <small>{e.casino_name}</small>}
                  </td>
                  <td>
                    {p(requestTypes[e.request_type])}
                    <small>
                      {e.services
                        ?.map((service) => p(serviceLabels[service]) || service)
                        .join(" · ")}
                    </small>
                    <small>
                      {e.start_date} → {e.end_date} · {e.party}{" "}
                      {t("adults", "ενήλικες")}
                    </small>
                  </td>
                  <td>
                    {p(statusPairs[e.status])}
                    <br />
                    <button
                      type="button"
                      className="crm-text-button"
                      aria-expanded={selectedId === e.id}
                      onClick={() =>
                        setSelectedId(selectedId === e.id ? null : e.id)
                      }
                    >
                      {selectedId === e.id
                        ? t("Close history", "Κλείσιμο ιστορικού")
                        : t("View history", "Προβολή ιστορικού")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {enquiries.isLoading && (
            <div className="empty">{t("Loading…", "Φόρτωση…")}</div>
          )}
          {enquiries.isError && (
            <div className="empty" role="alert">
              {t("Could not load enquiries.", "Αδυναμία φόρτωσης αιτημάτων.")}
              <button
                type="button"
                className="crm-text-button"
                onClick={() => void enquiries.refetch()}
              >
                {t("Try again", "Δοκιμάστε ξανά")}
              </button>
            </div>
          )}
          {enquiries.isSuccess && mine.length === 0 && (
            <div className="empty">
              {t("No enquiries yet.", "Δεν υπάρχουν αιτήματα ακόμη.")}
            </div>
          )}
        </div>
        {enquiries.hasNextPage && (
          <button
            type="button"
            className="crm-button"
            disabled={enquiries.isFetching}
            onClick={() => void enquiries.fetchNextPage()}
          >
            {enquiries.isFetchingNextPage
              ? t("Loading…", "Φόρτωση…")
              : t("Load older enquiries", "Παλαιότερα αιτήματα")}
          </button>
        )}
        {selectedId && mine.some((enquiry) => enquiry.id === selectedId) && (
          <EnquiryHistory key={selectedId} enquiryId={selectedId} />
        )}
      </div>
    </main>
  );
}
