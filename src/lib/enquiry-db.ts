import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  customerProfileSchema,
  type CustomerProfileInput,
} from "./customer-profile-schema";

export type Enquiry = Tables<"enquiries">;
export type Profile = Tables<"profiles">;
export const CRM_PAGE_SIZE = 100;

/** Email is synchronized from Auth by the database, never written by this form. */
export async function saveCustomerProfile(
  userId: string,
  input: CustomerProfileInput,
) {
  const value = customerProfileSchema.parse(input);
  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: value.firstName,
      last_name: value.lastName,
      full_name: `${value.firstName} ${value.lastName}`.slice(0, 160),
      phone: value.phone,
      residence: value.residence,
      customer_type: value.customerType,
      company_name:
        value.customerType === "business" ? value.companyName : null,
      services: value.services,
    })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  if (!data) throw new Error("No saved profile returned");
  return data;
}

/** Customer visibility is still constrained by profile RLS. */
export async function fetchCustomerProfiles(page = 0) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(page * CRM_PAGE_SIZE, (page + 1) * CRM_PAGE_SIZE - 1);
  if (error) throw error;
  return data;
}

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
export async function fetchEnquiries(page = 0) {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(page * CRM_PAGE_SIZE, (page + 1) * CRM_PAGE_SIZE - 1);
  if (error) throw error;
  return data;
}

/** Filter before limiting, including when an administrator views their account. */
export async function fetchMyEnquiries(userId: string, page = 0) {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(page * CRM_PAGE_SIZE, (page + 1) * CRM_PAGE_SIZE - 1);
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
