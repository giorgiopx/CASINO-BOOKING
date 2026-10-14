BEGIN;
CREATE TABLE IF NOT EXISTS public.global_casino_venues (
  id text PRIMARY KEY,
  name text NOT NULL,
  locality text NOT NULL,
  state text NOT NULL,
  country text NOT NULL CHECK(country IN ('US','AE')),
  official_url text NOT NULL,
  status text NOT NULL CHECK(status IN ('operating','planned','closed','unverified')),
  accommodation text NOT NULL CHECK(accommodation IN ('on-site','nearby')),
  gaming text NOT NULL CHECK(gaming IN ('casino','electronic-gaming','future-gaming')),
  source_checked date NOT NULL,
  notes_en text NOT NULL DEFAULT '',
  notes_el text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.global_casino_venues ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.global_casino_venues FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.global_casino_venues TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.global_casino_venues TO authenticated;
DROP POLICY IF EXISTS "Public read operating venues" ON public.global_casino_venues;
CREATE POLICY "Public read operating venues" ON public.global_casino_venues FOR SELECT TO anon,authenticated USING (status='operating');
DROP POLICY IF EXISTS "Admin manage global venues" ON public.global_casino_venues;
CREATE POLICY "Admin manage global venues" ON public.global_casino_venues FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(),'admin'::public.app_role));
INSERT INTO public.global_casino_venues (id,name,locality,state,country,official_url,status,accommodation,gaming,source_checked,notes_en,notes_el) VALUES
('bellagio','Bellagio Las Vegas','Las Vegas','Nevada','US','https://bellagio.mgmresorts.com/en.html','operating','on-site','casino','2026-10-14','Luxury casino hotel on the Las Vegas Strip.','Πολυτελές ξενοδοχείο-καζίνο στη Las Vegas Strip.'),
('wynn-las-vegas','Wynn Las Vegas & Encore','Las Vegas','Nevada','US','https://www.wynnlasvegas.com/casino','operating','on-site','casino','2026-10-14','High-end resort hotels and casino floors.','Πολυτελή ξενοδοχεία με χώρους καζίνο.'),
('venetian','The Venetian Resort & The Palazzo','Las Vegas','Nevada','US','https://www.venetianlasvegas.com/resort/casino.html','operating','on-site','casino','2026-10-14','Luxury all-suite resort with Venetian and Palazzo casinos.','Πολυτελές θέρετρο με καζίνο Venetian και Palazzo.'),
('hard-rock-hollywood','Seminole Hard Rock Hotel & Casino Hollywood','Hollywood (near Miami)','Florida','US','https://casino.hardrock.com/hollywood','operating','on-site','casino','2026-10-14','Guitar-shaped hotel and casino near Miami, not in downtown Miami.','Ξενοδοχείο και καζίνο στο Hollywood της Φλόριντα, κοντά στο Μαϊάμι.'),
('hard-rock-tampa','Seminole Hard Rock Hotel & Casino Tampa','Tampa','Florida','US','https://casino.hardrock.com/tampa','operating','on-site','casino','2026-10-14','Casino hotel and dining in Tampa.','Ξενοδοχείο-καζίνο με εστίαση στην Τάμπα.'),
('pechanga','Pechanga Resort Casino','Temecula','California','US','https://www.pechanga.com/','operating','on-site','casino','2026-10-14','Large resort casino in Temecula wine country.','Μεγάλο ξενοδοχειακό συγκρότημα καζίνο στην Τεμέκουλα.'),
('yaamava','Yaamava'' Resort & Casino at San Manuel','Highland','California','US','https://www.yaamava.com/','operating','on-site','casino','2026-10-14','Resort casino in the San Bernardino region.','Casino resort στην περιοχή Σαν Μπερναρντίνο.'),
('morongo','Morongo Casino Resort & Spa','Cabazon','California','US','https://www.morongocasinoresort.com/','operating','on-site','casino','2026-10-14','Casino and hotel near Palm Springs.','Καζίνο και ξενοδοχείο κοντά στο Παλμ Σπρινγκς.'),
('thunder-valley','Thunder Valley Casino Resort','Lincoln (Sacramento region)','California','US','https://www.thundervalleyresort.com/','operating','on-site','casino','2026-10-14','Casino hotel near Sacramento.','Ξενοδοχείο-καζίνο κοντά στο Σακραμέντο.'),
('resorts-world-nyc','Resorts World New York City','Queens, New York City','New York','US','https://rwnewyork.com/about/','operating','nearby','electronic-gaming','2026-10-14','Queens gaming facility: slots/electronic games; do not imply traditional live tables or on-site hotel.','Χώρος ηλεκτρονικών παιχνιδιών στο Κουίνς, όχι ισοδύναμος με ολοκληρωμένο casino resort.'),
('empire-city','Empire City Casino at Yonkers Raceway','Yonkers (NYC area)','New York','US','https://empirecitycasino.mgmresorts.com/en.html','operating','nearby','electronic-gaming','2026-10-14','Gaming/racetrack facility north of Manhattan, not a central Manhattan hotel.','Χώρος ηλεκτρονικών παιχνιδιών στο Γιόνκερς, βόρεια του Μανχάταν.'),
('borgata','Borgata Hotel Casino & Spa','Atlantic City','New Jersey','US','https://borgata.mgmresorts.com/en.html','operating','on-site','casino','2026-10-14','Atlantic City marina-district casino resort and hotel.','Casino resort και ξενοδοχείο στο Atlantic City.'),
('hard-rock-atlantic-city','Hard Rock Hotel & Casino Atlantic City','Atlantic City','New Jersey','US','https://casino.hardrock.com/atlantic-city/hotel-and-casino','operating','on-site','casino','2026-10-14','Boardwalk casino hotel and entertainment complex.','Ξενοδοχείο-καζίνο στο Boardwalk του Atlantic City.'),
('mohegan-sun','Mohegan Sun','Uncasville','Connecticut','US','https://mohegansun.com/','operating','on-site','casino','2026-10-14','Large casino resort with hotel and arena.','Μεγάλο casino resort με ξενοδοχείο και εκδηλώσεις.'),
('foxwoods','Foxwoods Resort Casino','Mashantucket','Connecticut','US','https://foxwoods.com/hotels','operating','on-site','casino','2026-10-14','Integrated casino resort with three hotel towers.','Casino resort με τρεις ξενοδοχειακούς πύργους.'),
('mgm-national-harbor','MGM National Harbor','Oxon Hill (Washington DC area)','Maryland','US','https://mgmnationalharbor.mgmresorts.com/en.html','operating','on-site','casino','2026-10-14','Casino hotel on the Potomac, just outside Washington DC.','Ξενοδοχείο-καζίνο στον Ποτόμακ, έξω από την Ουάσινγκτον.'),
('beau-rivage','Beau Rivage Resort & Casino','Biloxi','Mississippi','US','https://beaurivage.mgmresorts.com/','operating','on-site','casino','2026-10-14','Waterfront casino resort on the Mississippi Gulf Coast.','Παραθαλάσσιο casino resort στον Κόλπο του Μισισίπι.'),
('choctaw-durant','Choctaw Casino & Resort – Durant','Durant','Oklahoma','US','https://www.choctawcasinos.com/durant/','operating','on-site','casino','2026-10-14','Large casino resort with multiple hotel towers.','Μεγάλο casino resort με πολλαπλούς ξενοδοχειακούς πύργους.'),
('wynn-al-marjan','Wynn Al Marjan Island','Ras Al Khaimah','Ras Al Khaimah','AE','https://www.newsroom.wynnresorts.com/en/wynnalmarjan/','planned','on-site','future-gaming','2026-10-14','Licensed construction project, expected to open in 2027. NOT operational, no casino travel enquiries yet.','Αδειοδοτημένο έργο υπό κατασκευή, αναμενόμενο το 2027. ΔΕΝ λειτουργεί ως καζίνο.')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,locality=EXCLUDED.locality,state=EXCLUDED.state,country=EXCLUDED.country,official_url=EXCLUDED.official_url,status=EXCLUDED.status,accommodation=EXCLUDED.accommodation,gaming=EXCLUDED.gaming,source_checked=EXCLUDED.source_checked,notes_en=EXCLUDED.notes_en,notes_el=EXCLUDED.notes_el,updated_at=now();
COMMIT;