-- Additive upgrade for the existing accounts + audit + travel CRM schema.
-- Never recreates accounts, changes existing customer refs, or deletes data.
BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS services text[] NOT NULL DEFAULT '{}'::text[];

-- Names are deliberately not guessed by splitting historical full_name values.
UPDATE public.profiles p SET email = u.email
FROM auth.users u WHERE p.id = u.id AND p.email IS DISTINCT FROM u.email;

-- Future IDs use the complete UUID; historical IDs remain unchanged.
ALTER TABLE public.profiles ALTER COLUMN customer_ref
  SET DEFAULT ('CUS-' || upper(replace(gen_random_uuid()::text, '-', '')));

CREATE OR REPLACE FUNCTION public.cb_services_valid(values_to_check text[])
RETURNS boolean LANGUAGE sql IMMUTABLE SECURITY INVOKER SET search_path = '' AS $$
  SELECT values_to_check IS NOT NULL
    AND cardinality(values_to_check) <= 6
    AND array_position(values_to_check, NULL) IS NULL
    AND values_to_check <@ ARRAY['casino','flight','hotel','transfer','cruise','package']::text[]
    AND cardinality(values_to_check) = (SELECT count(DISTINCT value) FROM unnest(values_to_check) AS value)
$$;
REVOKE ALL ON FUNCTION public.cb_services_valid(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cb_services_valid(text[]) TO authenticated, service_role;

-- NOT VALID preserves historical rows; future writes enforce valid values.
ALTER TABLE public.profiles
  ADD CONSTRAINT cb_profile_names_valid CHECK (
    (first_name IS NULL OR char_length(btrim(first_name)) BETWEEN 1 AND 80)
    AND (last_name IS NULL OR char_length(btrim(last_name)) BETWEEN 1 AND 80)
  ) NOT VALID,
  ADD CONSTRAINT cb_profile_category_valid CHECK (customer_type IN ('individual','business')) NOT VALID,
  ADD CONSTRAINT cb_profile_services_valid CHECK (public.cb_services_valid(services)) NOT VALID,
  ADD CONSTRAINT cb_profile_contact_valid CHECK (
    (phone IS NULL OR char_length(phone) <= 24)
    AND (residence IS NULL OR char_length(residence) <= 80)
    AND (company_name IS NULL OR char_length(company_name) <= 160)
  ) NOT VALID;
ALTER TABLE public.enquiries ADD CONSTRAINT cb_enquiry_services_distinct
  CHECK (public.cb_services_valid(services) AND cardinality(services) >= 1) NOT VALID;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

-- Auth owns email. This private trigger cannot be called via the Data API.
-- Signup has no auth.uid(), so access is restricted to the auth.users trigger.
CREATE OR REPLACE FUNCTION private.cb_sync_profile_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.cb_sync_profile_email() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER zz_cb_sync_profile_email
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION private.cb_sync_profile_email();

-- Require a company for new business records and changes to account category
-- or company, while preserving legacy incomplete records and status updates.
CREATE OR REPLACE FUNCTION private.cb_require_company()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF NEW.customer_type = 'business' AND nullif(btrim(NEW.company_name), '') IS NULL THEN
    IF TG_OP = 'INSERT' THEN
      RAISE EXCEPTION 'Business accounts require a company name' USING ERRCODE = '23514';
    ELSIF NEW.customer_type IS DISTINCT FROM OLD.customer_type
       OR NEW.company_name IS DISTINCT FROM OLD.company_name THEN
      RAISE EXCEPTION 'Business accounts require a company name' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.cb_require_company() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER cb_profile_company_required BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION private.cb_require_company();
CREATE TRIGGER cb_enquiry_company_required BEFORE INSERT OR UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION private.cb_require_company();

-- Retain existing owner/admin policies and only expand editable profile fields.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
REVOKE UPDATE ON public.profiles FROM PUBLIC, anon, authenticated;
REVOKE UPDATE (id, customer_ref, created_at, email) ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT UPDATE (full_name, first_name, last_name, phone, residence, customer_type, company_name, services)
  ON public.profiles TO authenticated;

COMMIT;
