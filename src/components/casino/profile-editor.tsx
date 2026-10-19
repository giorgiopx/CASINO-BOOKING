import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { saveCustomerProfile, type Profile } from "@/lib/enquiry-db";
import {
  customerProfileSchema,
  type CustomerProfileInput,
} from "@/lib/customer-profile-schema";
import { useCasino } from "./context";
import { useAuth } from "./auth";
import { countryCodes, countryName, serviceLabels } from "@/lib/crm-display";
import "./crm.css";

export function CustomerProfileEditor({
  profile,
}: {
  profile: Profile | null | undefined;
}) {
  return profile ? <ProfileForm key={profile.id} profile={profile} /> : null;
}

function ProfileForm({ profile }: { profile: Profile }) {
  const { session } = useAuth();
  const { t, p, lang } = useCasino();
  const qc = useQueryClient();
  const [form, setForm] = useState<CustomerProfileInput>(() => ({
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    email: profile.email || session?.user.email || "",
    phone: profile.phone || "",
    residence: profile.residence || "",
    customerType:
      profile.customer_type === "business" ? "business" : "individual",
    companyName: profile.company_name || "",
    services: (profile.services || []).filter(
      (value): value is CustomerProfileInput["services"][number] =>
        value in serviceLabels,
    ),
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const update = <K extends keyof CustomerProfileInput>(
    field: K,
    value: CustomerProfileInput[K],
  ) => setForm((previous) => ({ ...previous, [field]: value }));
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!session || busy) return;
    setError("");
    const result = customerProfileSchema.safeParse(form);
    if (!result.success) {
      setInvalidFields(
        result.error.issues.map((issue) => String(issue.path[0])),
      );
      setError(
        t(
          "Check the highlighted fields. Enter your name, country and international mobile number (+country code), and choose at least one service.",
          "Ελέγξτε τα επισημασμένα πεδία. Συμπληρώστε όνομα, χώρα και κινητό με διεθνή κωδικό (+), και επιλέξτε τουλάχιστον μία υπηρεσία.",
        ),
      );
      return;
    }
    setInvalidFields([]);
    setBusy(true);
    try {
      const saved = await saveCustomerProfile(session.user.id, result.data);
      qc.setQueryData(["profile", session.user.id], saved);
      try {
        await qc.invalidateQueries(
          { queryKey: ["profiles", "admin", session.user.id], exact: true },
          { throwOnError: true },
        );
        toast.success(t("Profile saved", "Τα στοιχεία αποθηκεύτηκαν"));
      } catch {
        toast.warning(
          t(
            "Profile saved, but the customer directory could not refresh. Reload the directory to see your changes.",
            "Τα στοιχεία αποθηκεύτηκαν, αλλά ο κατάλογος πελατών δεν ανανεώθηκε. Φορτώστε ξανά τον κατάλογο για να δείτε τις αλλαγές.",
          ),
        );
      }
    } catch {
      setError(
        t(
          "Your profile could not be saved. Your changes are still here; try again. If this continues, contact the team.",
          "Τα στοιχεία δεν αποθηκεύτηκαν. Οι αλλαγές παραμένουν εδώ· δοκιμάστε ξανά. Εάν το πρόβλημα συνεχίζεται, επικοινωνήστε με την ομάδα.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  const countryOptions = countryCodes
    .map((code) => ({ code, label: countryName(code, lang) }))
    .sort((a, b) => a.label.localeCompare(b.label, lang));
  return (
    <form onSubmit={save} className="crm-card" noValidate aria-busy={busy}>
      <div className="crm-card-top">
        <div>
          <div className="eyebrow">{t("CUSTOMER CARD", "ΚΑΡΤΕΛΑ ΠΕΛΑΤΗ")}</div>
          <h2>{t("My customer profile", "Η καρτέλα πελάτη μου")}</h2>
        </div>
        <p>
          {t("Permanent customer ID", "Μόνιμος κωδικός πελάτη")}
          <br />
          <strong>{profile.customer_ref}</strong>
        </p>
      </div>
      <fieldset disabled={busy}>
        <div className="crm-fields" style={{ marginBottom: 20 }}>
          <label>
            {t("Customer category", "Κατηγορία πελάτη")}
            <select
              value={form.customerType}
              onChange={(event) =>
                update(
                  "customerType",
                  event.target.value as CustomerProfileInput["customerType"],
                )
              }
            >
              <option value="individual">{t("Individual", "Ιδιώτης")}</option>
              <option value="business">{t("Company", "Εταιρεία")}</option>
            </select>
          </label>
          {form.customerType === "business" && (
            <label>
              {t("Company name", "Επωνυμία εταιρείας")} *
              <input
                autoComplete="organization"
                value={form.companyName}
                maxLength={160}
                required
                aria-invalid={invalidFields.includes("companyName")}
                onChange={(event) => update("companyName", event.target.value)}
              />
            </label>
          )}
        </div>
        {profile.full_name && !profile.first_name && (
          <p className="crm-help" style={{ marginBottom: 16 }}>
            {t("Previously recorded name", "Προηγούμενο καταχωρημένο όνομα")}:{" "}
            {profile.full_name}.{" "}
            {t(
              "Please enter first and last name separately.",
              "Συμπληρώστε όνομα και επώνυμο ξεχωριστά.",
            )}
          </p>
        )}
        <div className="crm-fields">
          <label>
            {t("First name", "Όνομα")} *
            <input
              autoComplete="given-name"
              value={form.firstName}
              maxLength={80}
              required
              aria-invalid={invalidFields.includes("firstName")}
              onChange={(event) => update("firstName", event.target.value)}
            />
          </label>
          <label>
            {t("Last name", "Επώνυμο")} *
            <input
              autoComplete="family-name"
              value={form.lastName}
              maxLength={80}
              required
              aria-invalid={invalidFields.includes("lastName")}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </label>
          <label>
            {t("Mobile (+country code)", "Κινητό (+κωδικός χώρας)")} *
            <input
              type="tel"
              autoComplete="tel"
              value={form.phone}
              maxLength={24}
              required
              aria-invalid={invalidFields.includes("phone")}
              onChange={(event) => update("phone", event.target.value)}
            />
          </label>
          <label>
            {t("Account email", "Email λογαριασμού")}
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              readOnly
            />
            <span className="crm-help">
              {t(
                "Linked to your signed-in account.",
                "Συνδεδεμένο με τον λογαριασμό σας.",
              )}
            </span>
          </label>
          <label>
            {t("Country of residence", "Χώρα κατοικίας")} *
            <select
              autoComplete="country"
              value={form.residence}
              required
              aria-invalid={invalidFields.includes("residence")}
              onChange={(event) => update("residence", event.target.value)}
            >
              <option value="">{t("Select country", "Επιλέξτε χώρα")}</option>
              {form.residence && !countryCodes.includes(form.residence) && (
                <option value={form.residence}>{form.residence}</option>
              )}
              {countryOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset
          className="crm-services"
          aria-invalid={invalidFields.includes("services")}
        >
          <legend>
            {t(
              "Services of interest — choose one or more",
              "Υπηρεσίες ενδιαφέροντος — επιλέξτε μία ή περισσότερες",
            )}{" "}
            *
          </legend>
          <div className="crm-service-options">
            {Object.entries(serviceLabels).map(([service, label]) => (
              <label key={service}>
                <input
                  type="checkbox"
                  value={service}
                  checked={form.services.includes(
                    service as CustomerProfileInput["services"][number],
                  )}
                  onChange={(event) =>
                    update(
                      "services",
                      event.target.checked
                        ? [
                            ...form.services,
                            service as CustomerProfileInput["services"][number],
                          ]
                        : form.services.filter((value) => value !== service),
                    )
                  }
                />
                {p(label)}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="crm-help">
          {t(
            "Preferences help our team prepare your enquiries. Selecting a service does not create a booking.",
            "Οι προτιμήσεις βοηθούν την ομάδα να προετοιμάσει τα αιτήματά σας. Η επιλογή υπηρεσίας δεν δημιουργεί κράτηση.",
          )}
        </p>
        {error && (
          <p className="crm-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="crm-button"
          style={{ marginTop: 20 }}
          disabled={busy}
        >
          {busy
            ? t("Saving…", "Αποθήκευση…")
            : t("Save my profile", "Αποθήκευση στοιχείων")}
        </button>
      </fieldset>
    </form>
  );
}
