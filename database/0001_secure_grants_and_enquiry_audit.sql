-- 2026-10-14: Applied to live Lovable Supabase project. Reconcile before replay.
BEGIN;
REVOKE ALL PRIVILEGES ON TABLE public.enquiries, public.profiles, public.user_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.enquiries, public.profiles, public.user_roles TO authenticated;
GRANT INSERT ON TABLE public.enquiries TO authenticated;
GRANT UPDATE (status) ON TABLE public.enquiries TO authenticated;
GRANT UPDATE (full_name) ON TABLE public.profiles TO authenticated;
CREATE TABLE IF NOT EXISTS public.enquiry_status_events(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
 customer_id uuid NOT NULL, actor_id uuid,
 old_status text, new_status text NOT NULL,
 changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiry_status_events_customer_idx ON public.enquiry_status_events(customer_id,changed_at DESC);
CREATE INDEX IF NOT EXISTS enquiry_status_events_enquiry_idx ON public.enquiry_status_events(enquiry_id,changed_at DESC);
ALTER TABLE public.enquiry_status_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.enquiry_status_events FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.enquiry_status_events TO authenticated;
DROP POLICY IF EXISTS "Customers read own status history" ON public.enquiry_status_events;
CREATE POLICY "Customers read own status history" ON public.enquiry_status_events FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR public.has_role(auth.uid(),'admin'::public.app_role));
CREATE OR REPLACE FUNCTION public.log_enquiry_status_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
 IF TG_OP='INSERT' OR (TG_OP='UPDATE' AND NEW.status IS DISTINCT FROM OLD.status) THEN
  INSERT INTO public.enquiry_status_events(enquiry_id,customer_id,actor_id,old_status,new_status)
  VALUES(NEW.id,NEW.user_id,auth.uid(),CASE WHEN TG_OP='UPDATE' THEN OLD.status ELSE NULL END,NEW.status);
 END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_log_enquiry_status_event ON public.enquiries;
CREATE TRIGGER trg_log_enquiry_status_event AFTER INSERT OR UPDATE OF status ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.log_enquiry_status_event();
COMMIT;
-- Keep this AFTER initial 0000 schema migration so broad GRANT ALL isn't reintroduced.
