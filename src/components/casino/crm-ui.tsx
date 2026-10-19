import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/enquiry-db";
import { statusPairs } from "@/lib/casino-data";
import { useCasino } from "./context";
import { useAuth } from "./auth";
import "./crm.css";

import { countryName, serviceLabels } from "@/lib/crm-display";

export function CustomerCard({ profile }: { profile: Profile }) {
  const { t, p, lang } = useCasino();
  return (
    <section
      className="crm-card"
      aria-label={t("Customer profile", "Καρτέλα πελάτη")}
    >
      <div className="crm-card-top">
        <div>
          <div className="eyebrow">
            {profile.customer_type === "business"
              ? t("Company", "Εταιρεία")
              : t("Individual", "Ιδιώτης")}
          </div>
          <h2>
            {profile.company_name ||
              [profile.first_name, profile.last_name]
                .filter(Boolean)
                .join(" ") ||
              profile.full_name ||
              t("Customer profile", "Καρτέλα πελάτη")}
          </h2>
        </div>
        <p>
          {t("Permanent customer ID", "Μόνιμος κωδικός πελάτη")}
          <br />
          <strong>{profile.customer_ref}</strong>
        </p>
      </div>
      <dl className="crm-fields">
        <div>
          <dt>{t("First name", "Όνομα")}</dt>
          <dd>{profile.first_name || "—"}</dd>
        </div>
        <div>
          <dt>{t("Last name", "Επώνυμο")}</dt>
          <dd>{profile.last_name || "—"}</dd>
        </div>
        <div>
          <dt>{t("Mobile", "Κινητό")}</dt>
          <dd>{profile.phone || "—"}</dd>
        </div>
        <div>
          <dt>{t("Account email", "Email λογαριασμού")}</dt>
          <dd>{profile.email || "—"}</dd>
        </div>
        <div>
          <dt>{t("Country of residence", "Χώρα κατοικίας")}</dt>
          <dd>{countryName(profile.residence, lang)}</dd>
        </div>
        <div>
          <dt>{t("Services of interest", "Υπηρεσίες ενδιαφέροντος")}</dt>
          <dd>
            {profile.services
              ?.map((s) => p(serviceLabels[s]) || s)
              .join(" · ") || "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

/** Public-to-the-account history only: never query internal notes or tasks here. */
export function EnquiryHistory({ enquiryId }: { enquiryId: string }) {
  const { t, p, lang } = useCasino();
  const { session } = useAuth();
  const history = useQuery({
    queryKey: ["crm-history", enquiryId, session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const result = await supabase
        .from("enquiry_status_events")
        .select("*")
        .eq("enquiry_id", enquiryId)
        .order("changed_at", { ascending: false });
      if (result.error) throw result.error;
      return result.data;
    },
  });
  return (
    <section
      className="crm-card"
      aria-label={t("Request status history", "Ιστορικό κατάστασης αιτήματος")}
    >
      <h3>{t("Request status history", "Ιστορικό κατάστασης αιτήματος")}</h3>
      {history.isPending && (
        <p role="status">{t("Loading history…", "Φόρτωση ιστορικού…")}</p>
      )}
      {history.isError && (
        <p role="alert">
          {t("Could not load status history.", "Αδυναμία φόρτωσης ιστορικού.")}{" "}
          <button
            type="button"
            className="crm-text-button"
            onClick={() => void history.refetch()}
          >
            {t("Try again", "Δοκιμάστε ξανά")}
          </button>
        </p>
      )}
      {history.isSuccess && history.data.length === 0 && (
        <p>
          {t(
            "No status changes recorded yet.",
            "Δεν έχουν καταγραφεί αλλαγές κατάστασης.",
          )}
        </p>
      )}
      <ol className="crm-history">
        {history.data?.map((event) => (
          <li key={event.id}>
            <time dateTime={event.changed_at}>
              {new Date(event.changed_at).toLocaleString(lang)}
            </time>
            <span>
              {event.old_status
                ? `${p(statusPairs[event.old_status]) || event.old_status} → `
                : ""}
              <strong>
                {p(statusPairs[event.new_status]) || event.new_status}
              </strong>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
