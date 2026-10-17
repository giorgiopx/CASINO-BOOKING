import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (!isSupabaseConfigured()) throw redirect({ to: "/auth" });
    let authenticated = false;
    try {
      const { data, error } = await supabase.auth.getUser();
      authenticated = !error && !!data.user;
    } catch {
      // Expired sessions and unavailable auth both return to the sign-in page.
    }
    if (!authenticated) throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
