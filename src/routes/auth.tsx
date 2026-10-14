import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCasino } from "@/components/casino/context";
import { Intro } from "@/components/casino/public";
import { casinoHead } from "@/lib/casino-seo";

export const Route = createFileRoute("/auth")({
  head: () =>
    casinoHead(
      "Sign in or create an account",
      "Secure CasinoBooking.com account to save travel enquiries and follow their status.",
    ),
  component: AuthPage,
});

const creds = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  fullName: z.string().trim().max(160).optional(),
});

function AuthPage() {
  const { t } = useCasino();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = creds.safeParse(f);
    if (!parsed.success) {
      setMsg(t("Enter a valid email and a password of at least 8 characters.", "Εισάγετε έγκυρο email και κωδικό τουλάχιστον 8 χαρακτήρων."));
      return;
    }
    setBusy(true);
    setMsg("");
    const { email, password, fullName } = parsed.data;
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: fullName } },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      if (!data.session) {
        return setMsg(t("Check your inbox to confirm your email, then sign in.", "Ελέγξτε τα εισερχόμενά σας για επιβεβαίωση email και μετά συνδεθείτε."));
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(t("Sign-in failed. Check your details or confirm your email.", "Η σύνδεση απέτυχε. Ελέγξτε τα στοιχεία ή επιβεβαιώστε το email σας."));
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <main>
      <Intro
        title={mode === "signin" ? ["Welcome back", "Καλώς ήρθατε ξανά"] : ["Create your account", "Δημιουργήστε λογαριασμό"]}
        subtitle={[
          "Your account keeps your travel enquiries and their status in one place. Enquiries are not confirmed bookings.",
          "Ο λογαριασμός σας κρατά τα ταξιδιωτικά αιτήματα και την κατάστασή τους σε ένα σημείο. Τα αιτήματα δεν είναι επιβεβαιωμένες κρατήσεις.",
        ]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <form onSubmit={submit} className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            {mode === "signup" && (
              <label>
                {t("Full name", "Ονοματεπώνυμο")}
                <input name="fullName" maxLength={160} autoComplete="name" />
              </label>
            )}
            <label>
              Email *
              <input name="email" type="email" required maxLength={255} autoComplete="email" />
            </label>
            <label>
              {t("Password (min. 8 characters)", "Κωδικός (τουλ. 8 χαρακτήρες)")} *
              <input
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </label>
            {msg && <p role="alert" className="notice my-0">{msg}</p>}
            <Button variant="secondary" size="lg" type="submit" disabled={busy}>
              {mode === "signin" ? t("Sign in", "Σύνδεση") : t("Create account", "Δημιουργία λογαριασμού")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setMsg("");
              }}
            >
              {mode === "signin"
                ? t("New here? Create an account", "Νέος χρήστης; Δημιουργία λογαριασμού")
                : t("Already registered? Sign in", "Έχετε λογαριασμό; Σύνδεση")}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}