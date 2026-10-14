UPDATE public.global_casino_venues
 SET gaming='casino',
 notes_en='Operating full casino in Queens with live table games opened April 28, 2026; adjacent Hyatt Regency JFK Airport hotel.',
 notes_el='Καζίνο σε λειτουργία στο Κουίνς με επιτραπέζια παιχνίδια από 28 Απριλίου 2026 και γειτονικό Hyatt Regency JFK Airport.',
 updated_at=now()
 WHERE id='resorts-world-nyc' AND status='operating' AND country='US';
