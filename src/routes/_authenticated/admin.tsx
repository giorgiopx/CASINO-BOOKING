import { createFileRoute } from "@tanstack/react-router";
import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCasino } from "@/components/casino/context";
import { useAuth } from "@/components/casino/auth";
import {
  fetchEnquiries,
  fetchCustomerProfiles,
  CRM_PAGE_SIZE,
  type Enquiry,
} from "@/lib/enquiry-db";
import { requestTypes, statusPairs } from "@/lib/casino-data";
import { casinoHead } from "@/lib/casino-seo";
import { AdminEnquiryDetails } from "@/components/casino/admin-details";
import { CustomerCard } from "@/components/casino/crm-ui";
import { countryName, serviceLabels } from "@/lib/crm-display";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () =>
    casinoHead(
      "Admin CRM",
      "Administrator-only customer and enquiry management for CasinoBooking.com.",
    ),
  component: Admin,
});

function Admin() {
  const { t, p, lang } = useCasino();
  const { isAdmin, session } = useAuth();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [service, setService] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const enquiries = useInfiniteQuery({
    queryKey: ["enquiries", "admin", session?.user.id],
    queryFn: ({ pageParam }) => fetchEnquiries(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === CRM_PAGE_SIZE ? pages.length : undefined,
    enabled: isAdmin,
  });
  const profiles = useInfiniteQuery({
    queryKey: ["profiles", "admin", session?.user.id],
    queryFn: ({ pageParam }) => fetchCustomerProfiles(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === CRM_PAGE_SIZE ? pages.length : undefined,
    enabled: isAdmin,
  });
  const loadedProfiles = profiles.data?.pages.flat() ?? [];
  const loadedEnquiries = enquiries.data?.pages.flat() ?? [];
  const profileMap = new Map(
    loadedProfiles.map((profile) => [profile.id, profile]),
  );
  const customer = selectedCustomerId
    ? profileMap.get(selectedCustomerId)
    : undefined;
  const search = query.trim().toLocaleLowerCase();
  const customers = loadedProfiles.filter(
    (profile) =>
      [
        profile.customer_ref,
        profile.first_name,
        profile.last_name,
        profile.full_name,
        profile.email,
        profile.phone,
        profile.company_name,
        countryName(profile.residence, lang),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search) &&
      (category === "all" || profile.customer_type === category) &&
      (service === "all" || profile.services?.includes(service)),
  );
  const rows = loadedEnquiries.filter((enquiry) => {
    const profile = profileMap.get(enquiry.user_id);
    return (
      (!selectedCustomerId || enquiry.user_id === selectedCustomerId) &&
      [
        enquiry.ref,
        enquiry.name,
        enquiry.surname,
        enquiry.email,
        enquiry.phone,
        enquiry.company_name,
        enquiry.destination,
        profile?.customer_ref,
        profile?.first_name,
        profile?.last_name,
        profile?.company_name,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search) &&
      (status === "all" || enquiry.status === status) &&
      (category === "all" || enquiry.customer_type === category) &&
      (service === "all" || enquiry.services?.includes(service))
    );
  });
  const current = rows.find((enquiry) => enquiry.id === selectedId);

  async function changeStatus(id: string, next: string) {
    if (!session || !isAdmin || savingId) return;
    setSavingId(id);
    try {
      const result = await supabase
        .from("enquiries")
        .update({ status: next })
        .eq("id", id)
        .select("id,status")
        .single();
      if (result.error || !result.data)
        throw result.error || new Error("No updated record");
      qc.setQueriesData<InfiniteData<Enquiry[]>>(
        {
          queryKey: ["enquiries"],
          predicate: (query) => query.queryKey[2] === session.user.id,
        },
        (previous) =>
          previous
            ? {
                ...previous,
                pages: previous.pages.map((page) =>
                  page.map((enquiry) =>
                    enquiry.id === id
                      ? { ...enquiry, status: result.data.status }
                      : enquiry,
                  ),
                ),
              }
            : previous,
      );
      try {
        await Promise.all([
          qc.invalidateQueries(
            {
              queryKey: ["enquiries"],
              predicate: (query) => query.queryKey[2] === session.user.id,
            },
            { throwOnError: true },
          ),
          qc.invalidateQueries(
            { queryKey: ["crm-history", id, session.user.id], exact: true },
            { throwOnError: true },
          ),
        ]);
        toast.success(t("Status updated", "Η κατάσταση ενημερώθηκε"));
      } catch {
        toast.warning(
          t(
            "Status saved, but the list or history could not refresh. Retry loading the records.",
            "Η κατάσταση αποθηκεύτηκε, αλλά η λίστα ή το ιστορικό δεν ανανεώθηκε. Δοκιμάστε ξανά τη φόρτωση.",
          ),
        );
      }
    } catch {
      toast.error(
        t(
          "Status was not saved. Please try again.",
          "Η κατάσταση δεν αποθηκεύτηκε. Δοκιμάστε ξανά.",
        ),
      );
    } finally {
      setSavingId(null);
    }
  }

  if (!isAdmin)
    return (
      <main className="section">
        <div className="container">
          <h1 className="page-title">
            {t("Access restricted", "Περιορισμένη πρόσβαση")}
          </h1>
          <p>
            {t(
              "This area is available to authorized administrators only.",
              "Η περιοχή είναι διαθέσιμη μόνο σε εξουσιοδοτημένους διαχειριστές.",
            )}
          </p>
        </div>
      </main>
    );

  return (
    <main
      className="section"
      style={{
        background: "linear-gradient(180deg,#f8f5f0,#fff)",
        minHeight: "95vh",
      }}
    >
      <div className="container">
        <div className="eyebrow">
          {t("ADMIN CRM · ADMINISTRATORS ONLY", "CRM · ΜΟΝΟ ΔΙΑΧΕΙΡΙΣΤΕΣ")}
        </div>
        <h1 className="page-title">
          {t("Customers & enquiries", "Πελάτες & αιτήματα")}
        </h1>
        <p className="section-subtitle">
          {t("Signed in as", "Συνδεδεμένος ως")} {session?.user.email} ·{" "}
          {t("Loaded customers", "Φορτωμένοι πελάτες")}:{" "}
          {profiles.data ? loadedProfiles.length : "…"} ·{" "}
          {t("Loaded enquiries", "Φορτωμένα αιτήματα")}:{" "}
          {enquiries.data ? loadedEnquiries.length : "…"}
        </p>
        <div className="notice">
          {t(
            "Travel enquiries only — no booking, partnership or commission is confirmed. Email and WhatsApp delivery is not connected. Update the customer’s enquiry status here; they can see its history in their account.",
            "Μόνο ταξιδιωτικά αιτήματα — καμία κράτηση, συνεργασία ή προμήθεια δεν επιβεβαιώνεται. Η αποστολή email και WhatsApp δεν έχει συνδεθεί. Ενημερώστε εδώ την κατάσταση αιτήματος· ο πελάτης βλέπει το ιστορικό στον λογαριασμό του.",
          )}
        </div>
        <div className="crm-filters">
          <label>
            {t(
              "Search customers and enquiries",
              "Αναζήτηση πελατών και αιτημάτων",
            )}
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t(
                "Name, ID, email, mobile, company…",
                "Όνομα, κωδικός, email, κινητό, εταιρεία…",
              )}
            />
          </label>
          <label>
            {t("Customer category", "Κατηγορία πελάτη")}
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">
                {t("All categories", "Όλες οι κατηγορίες")}
              </option>
              <option value="individual">{t("Individual", "Ιδιώτης")}</option>
              <option value="business">{t("Company", "Εταιρεία")}</option>
            </select>
          </label>
          <label>
            {t("Service", "Υπηρεσία")}
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              <option value="all">
                {t("All services", "Όλες οι υπηρεσίες")}
              </option>
              {Object.entries(serviceLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {p(label)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Enquiry status", "Κατάσταση αιτήματος")}
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">
                {t("All statuses", "Όλες οι καταστάσεις")}
              </option>
              {Object.entries(statusPairs).map(([key, label]) => (
                <option key={key} value={key}>
                  {p(label)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <section
          className="crm-directory"
          aria-label={t("Customer directory", "Κατάλογος πελατών")}
        >
          <h2>{t("Customer directory", "Κατάλογος πελατών")}</h2>
          <p className="crm-help">
            {t(
              "Every registered customer has a separate card, including customers who have not submitted an enquiry.",
              "Κάθε εγγεγραμμένος πελάτης έχει ξεχωριστή καρτέλα, ακόμη και χωρίς υποβληθέν αίτημα.",
            )}
          </p>
          {profiles.isPending && (
            <p role="status">{t("Loading customers…", "Φόρτωση πελατών…")}</p>
          )}
          {profiles.isError && (
            <p role="alert" className="crm-error">
              {t(
                "Could not load customer cards.",
                "Αδυναμία φόρτωσης καρτελών πελατών.",
              )}{" "}
              <button
                type="button"
                className="crm-text-button"
                onClick={() => void profiles.refetch()}
              >
                {t("Try again", "Δοκιμάστε ξανά")}
              </button>
            </p>
          )}
          {profiles.data && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t("Customer / ID", "Πελάτης / κωδικός")}</th>
                    <th>{t("Category / country", "Κατηγορία / χώρα")}</th>
                    <th>{t("Contact", "Επικοινωνία")}</th>
                    <th>{t("Customer card", "Καρτέλα πελάτη")}</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((profile) => (
                    <tr key={profile.id}>
                      <td>
                        <strong>
                          {[profile.first_name, profile.last_name]
                            .filter(Boolean)
                            .join(" ") ||
                            profile.full_name ||
                            "—"}
                        </strong>
                        <small>{profile.customer_ref}</small>
                        {profile.company_name && (
                          <small>{profile.company_name}</small>
                        )}
                      </td>
                      <td>
                        {profile.customer_type === "business"
                          ? t("Company", "Εταιρεία")
                          : t("Individual", "Ιδιώτης")}
                        <small>{countryName(profile.residence, lang)}</small>
                      </td>
                      <td>
                        {profile.email || "—"}
                        <small>{profile.phone || "—"}</small>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="crm-button crm-select-row"
                          aria-pressed={selectedCustomerId === profile.id}
                          onClick={() => {
                            setSelectedCustomerId(profile.id);
                            setSelectedId(null);
                            setQuery("");
                            setStatus("all");
                            setCategory("all");
                            setService("all");
                          }}
                        >
                          {t("Open card", "Άνοιγμα καρτέλας")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customers.length === 0 && (
                <p className="empty">
                  {t("No matching customers.", "Δεν βρέθηκαν πελάτες.")}
                </p>
              )}
            </div>
          )}
          {profiles.hasNextPage && (
            <button
              type="button"
              className="crm-button"
              disabled={profiles.isFetching}
              onClick={() => void profiles.fetchNextPage()}
            >
              {profiles.isFetchingNextPage
                ? t("Loading…", "Φόρτωση…")
                : t("Load more customers", "Περισσότεροι πελάτες")}
            </button>
          )}
        </section>
        {customer && (
          <>
            <div className="crm-selection">
              <strong>
                {t("Customer selected", "Επιλεγμένος πελάτης")}:{" "}
                {customer.customer_ref}
              </strong>
              <button
                type="button"
                className="crm-text-button"
                onClick={() => {
                  setSelectedCustomerId(null);
                  setSelectedId(null);
                }}
              >
                {t(
                  "Show all customers’ enquiries",
                  "Εμφάνιση αιτημάτων όλων των πελατών",
                )}
              </button>
            </div>
            <CustomerCard profile={customer} />
          </>
        )}
        <section
          className="crm-directory"
          aria-label={t("Enquiries", "Αιτήματα")}
        >
          <h2>
            {customer
              ? t("This customer’s enquiries", "Αιτήματα αυτού του πελάτη")
              : t("Enquiries", "Αιτήματα")}
          </h2>
          {enquiries.isPending && (
            <p role="status">{t("Loading enquiries…", "Φόρτωση αιτημάτων…")}</p>
          )}
          {enquiries.isError && (
            <p role="alert" className="crm-error">
              {t(
                "Could not load CRM enquiries.",
                "Αδυναμία φόρτωσης αιτημάτων CRM.",
              )}{" "}
              <button
                type="button"
                className="crm-text-button"
                onClick={() => void enquiries.refetch()}
              >
                {t("Try again", "Δοκιμάστε ξανά")}
              </button>
            </p>
          )}
          {enquiries.data && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t("Customer / reference", "Πελάτης / αναφορά")}</th>
                    <th>{t("Request / travel", "Αίτημα / ταξίδι")}</th>
                    <th>{t("Status", "Κατάσταση")}</th>
                    <th>{t("Details", "Λεπτομέρειες")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td>
                        {enquiry.name} {enquiry.surname}
                        <small>
                          {profileMap.get(enquiry.user_id)?.customer_ref || "—"}
                        </small>
                        <strong>{enquiry.ref}</strong>
                      </td>
                      <td>
                        {enquiry.destination}
                        <small>{p(requestTypes[enquiry.request_type])}</small>
                        <small>
                          {enquiry.start_date} → {enquiry.end_date} ·{" "}
                          {enquiry.party} {t("adults", "ενήλικες")}
                        </small>
                        <small>
                          {enquiry.services
                            ?.map((key) => p(serviceLabels[key]) || key)
                            .join(" · ")}
                        </small>
                      </td>
                      <td>
                        <select
                          value={enquiry.status}
                          disabled={!!savingId}
                          onChange={(event) =>
                            void changeStatus(enquiry.id, event.target.value)
                          }
                          aria-label={`${t("Status for", "Κατάσταση για")} ${enquiry.ref}`}
                        >
                          {Object.entries(statusPairs).map(([key, label]) => (
                            <option key={key} value={key}>
                              {p(label)}
                            </option>
                          ))}
                        </select>
                        {savingId === enquiry.id && (
                          <small role="status">
                            {t("Saving…", "Αποθήκευση…")}
                          </small>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="crm-button"
                          aria-expanded={selectedId === enquiry.id}
                          onClick={() =>
                            setSelectedId(
                              selectedId === enquiry.id ? null : enquiry.id,
                            )
                          }
                        >
                          {selectedId === enquiry.id
                            ? t("Close details", "Κλείσιμο λεπτομερειών")
                            : t("Open enquiry", "Άνοιγμα αιτήματος")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <p className="empty">
                  {t("No matching enquiries.", "Δεν βρέθηκαν αιτήματα.")}
                </p>
              )}
            </div>
          )}
          {enquiries.hasNextPage && (
            <button
              type="button"
              className="crm-button"
              disabled={enquiries.isFetching}
              onClick={() => void enquiries.fetchNextPage()}
            >
              {enquiries.isFetchingNextPage
                ? t("Loading…", "Φόρτωση…")
                : t("Load more enquiries", "Περισσότερα αιτήματα")}
            </button>
          )}
        </section>
        {current && (
          <AdminEnquiryDetails
            key={current.id}
            enquiry={current}
            customerRef={profileMap.get(current.user_id)?.customer_ref || "—"}
          />
        )}
        {(profiles.hasNextPage || enquiries.hasNextPage) && (
          <p className="crm-help">
            {t(
              "Search and filters cover loaded records. Load more customers or enquiries to include older records.",
              "Η αναζήτηση και τα φίλτρα αφορούν τις φορτωμένες εγγραφές. Φορτώστε περισσότερους πελάτες ή αιτήματα για παλαιότερες εγγραφές.",
            )}
          </p>
        )}
      </div>
    </main>
  );
}
