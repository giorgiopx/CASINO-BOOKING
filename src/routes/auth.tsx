import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCasino } from "@/components/casino/context";
import { Intro } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";
import { useAuth } from "@/components/casino/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({
    mode: z.enum(["signin", "signup"]).optional().catch(undefined),
  }),
  head: () =>
    casinoHead(
      "Sign in or create an account",
      "Secure CasinoBooking.com account to save travel enquiries and follow their status.",
    ),
  component: AuthPage,
});

const creds = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
  fullName: z.string().trim().max(160).optional(),
});

function AuthPage() {
  const { t } = useCasino();
  const navigate = useNavigate();
  const mode = Route.useSearch().mode ?? "signin";
  const { available, ready } = useAuth();
  const submitting = useRef(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current || !ready || !available) return;
    setMsg("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (
      mode === "signup" &&
      (f["adultConfirmation"] !== "on" || f["privacyAcceptance"] !== "on")
    ) {
      setMsg(
        t(
          "Please confirm your legal age and accept the privacy/terms notices before creating an account.",
          "Επιβεβαιώστε τη νόμιμη ηλικία σας και αποδεχθείτε τις ενημερώσεις απορρήτου και όρων για να δημιουργήσετε λογαριασμό.",
        ),
      );
      return;
    }
    const parsed = creds.safeParse(f);
    if (
      !parsed.success ||
      (mode === "signup" && parsed.data.password.length < 8)
    ) {
      setMsg(
        t(
          mode === "signup"
            ? "Enter a valid email and a password of at least 8 characters."
            : "Enter your email and password.",
          mode === "signup"
            ? "Εισάγετε έγκυρο email και κωδικό τουλάχιστον 8 χαρακτήρων."
            : "Εισάγετε το email και τον κωδικό σας.",
        ),
      );
      return;
    }
    submitting.current = true;
    setBusy(true);
    setMsg("");
    try {
      const { email, password, fullName } = parsed.data;
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) return setMsg(error.message);
        if (!data.session) {
          return setMsg(
            t(
              "Check your inbox to confirm your email, then sign in.",
              "Ελέγξτε τα εισερχόμενά σας για επιβεβαίωση email και μετά συνδεθείτε.",
            ),
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error)
          return setMsg(
            t(
              "Sign-in failed. Check your details or confirm your email.",
              "Η σύνδεση απέτυχε. Ελέγξτε τα στοιχεία ή επιβεβαιώστε το email σας.",
            ),
          );
      }
      await navigate({ to: "/dashboard" });
    } catch {
      setMsg(
        t(
          "Account services could not be reached. Please try again.",
          "Δεν ήταν δυνατή η σύνδεση στις υπηρεσίες λογαριασμού. Δοκιμάστε ξανά.",
        ),
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <main>
      <Intro
        title={
          mode === "signin"
            ? ["Welcome back", "Καλώς ήρθατε ξανά"]
            : ["Create your account", "Δημιουργήστε λογαριασμό"]
        }
        subtitle={[
          "Your account keeps your travel enquiries and their status in one place. Enquiries are not confirmed bookings.",
          "Ο λογαριασμός σας κρατά τα ταξιδιωτικά αιτήματα και την κατάστασή τους σε ένα σημείο. Τα αιτήματα δεν είναι επιβεβαιωμένες κρατήσεις.",
        ]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <form
            onSubmit={submit}
            aria-busy={busy}
            className="form-grid"
            style={{ gridTemplateColumns: "1fr" }}
          >
            {ready && !available && (
              <p className="notice my-0" role="status">
                {t(
                  "Account services are temporarily unavailable. Please return later to sign in or create an account.",
                  "Οι υπηρεσίες λογαριασμού είναι προσωρινά μη διαθέσιμες. Επιστρέψτε αργότερα για σύνδεση ή δημιουργία λογαριασμού.",
                )}
              </p>
            )}
            {mode === "signup" && (
              <label>
                {t("Full name", "Ονοματεπώνυμο")}
                <input name="fullName" maxLength={160} autoComplete="name" />
              </label>
            )}
            <label>
              Email *
              <input
                name="email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
              />
            </label>
            <label>
              {mode === "signup"
                ? t(
                    "Password (min. 8 characters)",
                    "Κωδικός (τουλ. 8 χαρακτήρες)",
                  )
                : t("Password", "Κωδικός")}{" "}
              *
              <input
                name="password"
                type="password"
                required
                minLength={mode === "signup" ? 8 : 1}
                maxLength={72}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
            </label>
            {mode === "signup" && (
              <div className="grid gap-3 text-sm">
                <label className="flex items-start gap-2">
                  <input type="checkbox" name="adultConfirmation" required />
                  <span>
                    {t(
                      "I am at least 18, and understand that each casino has its own legal age requirement (21+ in some US locations).",
                      "Είμαι τουλάχιστον 18 ετών και κατανοώ ότι κάθε καζίνο εφαρμόζει τη νόμιμη ηλικία εισόδου (σε ορισμένες περιοχές των ΗΠΑ 21+).",
                    )}
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" name="privacyAcceptance" required />
                  <span>
                    {t(
                      "I have read the privacy notice and terms for a free travel enquiry account.",
                      "Έχω διαβάσει την πολιτική απορρήτου και τους όρους του δωρεάν λογαριασμού ταξιδιωτικών αιτημάτων.",
                    )}{" "}
                    <a className="underline" href="/privacy">
                      {t("Privacy", "Απόρρητο")}
                    </a>
                    {" · "}
                    <a className="underline" href="/terms">
                      {t("Terms", "Όροι")}
                    </a>
                  </span>
                </label>
              </div>
            )}
            {msg && (
              <p role="alert" className="notice my-0">
                {msg}
              </p>
            )}
            <Button
              variant="secondary"
              size="lg"
              type="submit"
              disabled={busy || !ready || !available}
            >
              {busy
                ? t("Please wait…", "Παρακαλώ περιμένετε…")
                : mode === "signin"
                  ? t("Sign in", "Σύνδεση")
                  : t("Create account", "Δημιουργία λογαριασμού")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => {
                setMsg("");
                void navigate({
                  to: "/auth",
                  search: { mode: mode === "signin" ? "signup" : "signin" },
                }).catch(() =>
                  setMsg(t("Please try again.", "Δοκιμάστε ξανά.")),
                );
              }}
            >
              {mode === "signin"
                ? t(
                    "New here? Create an account",
                    "Νέος χρήστης; Δημιουργία λογαριασμού",
                  )
                : t("Already registered? Sign in", "Έχετε λογαριασμό; Σύνδεση")}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
