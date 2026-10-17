import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Enquiry = Tables<"enquiries">;
export type Profile = Tables<"profiles">;

export async function fetchMyProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** RLS returns only the caller's rows for customers and all rows for admins. */
export async function fetchEnquiries() {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return data;
}

export async function fetchProfilesByIds(ids: string[]) {
  if (ids.length === 0) return [] as Profile[];
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return data;
}
