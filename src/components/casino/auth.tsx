import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useCasino } from "./context";

type AuthState = {
  session: Session | null;
  ready: boolean;
  available: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};
const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(false);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const signingOut = useRef(false);
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useCasino();

  useEffect(() => {
    let active = true;
    let authEventReceived = false;
    let unsubscribe: (() => void) | undefined;
    if (!isSupabaseConfigured()) {
      setReady(true);
      setAvailable(false);
      return;
    }
    try {
      const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
        if (!active) return;
        authEventReceived = true;
        setSession(nextSession);
        setReady(true);
        setAvailable(true);
        if (
          event !== "SIGNED_IN" &&
          event !== "SIGNED_OUT" &&
          event !== "USER_UPDATED"
        )
          return;
        if (event === "SIGNED_OUT") {
          setAdminUserId(null);
          queryClient.clear();
        }
        // Leave the auth callback before route/query refreshes can call Auth again.
        setTimeout(() => {
          if (!active) return;
          void router.invalidate().catch(() => {});
          if (event !== "SIGNED_OUT")
            void queryClient.invalidateQueries().catch(() => {});
        }, 0);
      });
      unsubscribe = () => data.subscription.unsubscribe();
      void supabase.auth
        .getSession()
        .then(({ data, error }) => {
          if (!active || authEventReceived) return;
          setSession(error ? null : data.session);
          setAvailable(!error);
          setReady(true);
        })
        .catch(() => {
          if (!active || authEventReceived) return;
          setAvailable(false);
          setReady(true);
        });
    } catch {
      setSession(null);
      setAvailable(false);
      setReady(true);
    }
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [router, queryClient]);

  const userId = session?.user.id;
  useEffect(() => {
    let active = true;
    setAdminUserId(null);
    if (userId) {
      // A UI hint only: RLS remains the authoritative gate on database operations.
      void (async () => {
        try {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .eq("role", "admin")
            .maybeSingle();
          if (active) setAdminUserId(!error && data ? userId : null);
        } catch {
          if (active) setAdminUserId(null);
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [userId]);

  async function signOut() {
    if (signingOut.current) return;
    signingOut.current = true;
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      setSession(null);
      setAdminUserId(null);
      await queryClient.cancelQueries();
      queryClient.clear();
      await navigate({ to: "/auth", replace: true });
    } catch {
      toast.error(
        t(
          "Sign out could not be completed. Please try again.",
          "Η αποσύνδεση δεν ολοκληρώθηκε. Δοκιμάστε ξανά.",
        ),
      );
    } finally {
      signingOut.current = false;
    }
  }

  return (
    <Ctx.Provider
      value={{
        session,
        ready,
        available,
        isAdmin: !!userId && adminUserId === userId,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AuthProvider required");
  return v;
}
