import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useCasino } from "@/components/casino/context";
import {
  searchGlobalDestinations,
  globalCasinoHotels,
  photoUrl,
} from "@/lib/global-casino-catalog";
import { casinoHead } from "@/lib/casino-seo";
import "./global-casinos.css";

export const Route = createFileRoute("/global-casinos")({
  head: () =>
    casinoHead(
      "United States casino resorts | CasinoBooking.com",
      "Explore official-source US casino resorts and hotel destinations. UAE Wynn Al Marjan Island is a planned 2027 development, not open. Free travel enquiries only.",
    ),
  component: GlobalCasinos,
});
function GlobalCasinos() {
  const { t, lang } = useCasino();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"US" | "AE" | "all">("US");
  const destinations = useMemo(
    () => searchGlobalDestinations(q, filter),
    [q, filter],
  );
  const resultCount = destinations.reduce(
    (total, { venues }) => total + venues.length,
    0,
  );
  const plannedCount = destinations.reduce(
    (total, { venues }) =>
      total + venues.filter((venue) => venue.status === "planned").length,
    0,
  );

  return (
    <main className="global-casino-page">
      <div className="global-hero">
        <div className="global-shell">
          <div className="global-eyebrow">
            CASINOBOOKING.COM ·{" "}
            {t("INTERNATIONAL DESTINATIONS", "ΔΙΕΘΝΕΙΣ ΠΡΟΟΡΙΣΜΟΙ")}
          </div>
          <h1>
            {t(
              "Discover American casino destinations",
              "Ανακαλύψτε αμερικανικούς προορισμούς καζίνο",
            )}
          </h1>
          <p>
            {t(
              "Curated, independently researched casino hotels across the United States. Request free flight, hotel and transfer coordination. These are enquiries, not confirmed bookings.",
              "Επιλεγμένοι προορισμοί με ξενοδοχεία-καζίνο στις ΗΠΑ. Ζητήστε δωρεάν συντονισμό πτήσεων, διαμονής και μεταφορών. Τα αιτήματα δεν είναι επιβεβαιωμένες κρατήσεις.",
            )}
          </p>
          <div className="global-find">
            <Search size={19} />
            <input
              type="search"
              aria-label={t(
                "Search city, state or casino",
                "Αναζήτηση πόλης, πολιτείας ή καζίνο",
              )}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t(
                "Search Las Vegas, Miami, New York, casino...",
                "Αναζήτηση Λας Βέγκας, Μαϊάμι, Νέα Υόρκη, καζίνο...",
              )}
            />
          </div>
          <div className="global-pills">
            <button
              type="button"
              aria-pressed={filter === "US"}
              onClick={() => setFilter("US")}
            >
              {t(
                "United States · Operator-listed venues",
                "ΗΠΑ · Καταχωρίσεις διαχειριστών",
              )}
            </button>
            <button
              type="button"
              aria-pressed={filter === "AE"}
              onClick={() => setFilter("AE")}
            >
              {t("UAE · Planned (2027)", "ΗΑΕ · Υπό κατασκευή (2027)")}
            </button>
            <button
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              {t("Show both", "Προβολή όλων")}
            </button>
          </div>
        </div>
      </div>
      <div className="global-shell global-content">
        <p className="global-notice">
          <ShieldCheck size={17} />
          {t(
            "No venue partnerships or live booking inventory are claimed. Check age limits and operating status before travel. Images depict the destination/region, not necessarily the named casino. Wikimedia photo credits are provided below.",
            "Δεν δηλώνουμε συνεργασίες ή πραγματική διαθεσιμότητα κρατήσεων. Ελέγξτε νόμιμη ηλικία και λειτουργία πριν ταξιδέψετε. Οι εικόνες απεικονίζουν τον προορισμό, όχι απαραίτητα το συγκεκριμένο καζίνο. Αναφέρονται οι δημιουργοί των φωτογραφιών.",
          )}
        </p>
        <div className="global-result-summary">
          <p role="status" aria-live="polite">
            {destinations.length} {t("regions", "περιοχές")} ·{" "}
            {resultCount - plannedCount}{" "}
            {t("operator-listed venues", "καταχωρισμένοι χώροι")} ·{" "}
            {plannedCount} {t("planned projects", "μελλοντικά έργα")}
          </p>
          {(q || filter !== "US") && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setFilter("US");
              }}
            >
              {t("Reset filters", "Επαναφορά φίλτρων")}
            </button>
          )}
          <Link to="/destinations">
            {t("All 15 countries →", "Και οι 15 χώρες →")}
          </Link>
        </div>
        <div className="global-grid">
          {destinations.map(({ destination: d, venues }) => {
            const planned = d.country === "AE";
            const image = photoUrl(d);
            return (
              <article className="global-card" key={d.slug}>
                <div className="global-card-photo">
                  {image ? (
                    <img
                      loading="lazy"
                      alt={
                        t(d.name[0], d.name[1]) +
                        t(
                          " — destination image, not property image",
                          " — εικόνα περιοχής, όχι του καταλύματος",
                        )
                      }
                      src={image}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="global-photo-fallback">
                      <MapPin size={37} />
                    </span>
                  )}
                  <span
                    className={
                      planned ? "global-state global-planned" : "global-state"
                    }
                  >
                    {planned
                      ? t("Planned — not open", "Υπό ανάπτυξη — μη ανοικτό")
                      : t(d.state, d.stateEl)}
                  </span>
                  <div className="global-photo-title">
                    <h2>{lang === "el" ? d.name[1] : d.name[0]}</h2>
                    <p>{lang === "el" ? d.subtitle[1] : d.subtitle[0]}</p>
                  </div>
                </div>
                <div className="global-card-body">
                  {venues.map((v) => (
                    <div className="global-venue" key={v.id}>
                      <h3>{v.name}</h3>
                      <span>
                        {t(v.locality, v.localityEl)} ·{" "}
                        {v.status === "operating"
                          ? t(
                              "Operator-listed · verify status",
                              "Καταχώριση διαχειριστή · έλεγχος λειτουργίας",
                            )
                          : t("Future development", "Μελλοντικό έργο")}
                      </span>
                      <p>{lang === "el" ? v.notes[1] : v.notes[0]}</p>
                      {v.gaming === "electronic-gaming" && (
                        <p>
                          {t(
                            "Electronic gaming venue",
                            "Χώρος ηλεκτρονικών παιχνιδιών",
                          )}
                        </p>
                      )}
                      <small className="global-checked">
                        {t("Source checked", "Έλεγχος πηγής")}:{" "}
                        {v.sourceChecked}
                      </small>
                      {globalCasinoHotels
                        .filter((h) => h.venueId === v.id)
                        .map((h) => (
                          <p className="global-hotel" key={h.hotelName}>
                            <strong>{t("Hotel", "Ξενοδοχείο")}:</strong>{" "}
                            {h.hotelName}{" "}
                            <small>
                              (
                              {t(
                                h.location === "nearby"
                                  ? "nearby"
                                  : h.location === "adjacent"
                                    ? "adjacent"
                                    : "on-site",
                                h.location === "nearby"
                                  ? "κοντά"
                                  : h.location === "adjacent"
                                    ? "δίπλα"
                                    : "εντός συγκροτήματος",
                              )}
                              )
                            </small>
                            {" · "}
                            <a
                              href={h.officialHotelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("hotel source ↗", "πηγή ξενοδοχείου ↗")}
                            </a>
                          </p>
                        ))}
                      <div className="global-venue-actions">
                        <a
                          href={v.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("Official source", "Επίσημη πηγή")}{" "}
                          <ExternalLink size={13} />
                        </a>
                        {v.status === "operating" && (
                          <Link to="/request" search={{ interest: v.name }}>
                            {t("Request trip", "Αίτημα ταξιδιού")}{" "}
                            <ArrowRight size={13} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                  {planned && (
                    <div className="global-warn">
                      {t(
                        "Wynn Al Marjan Island is not open: no current casino trip can be arranged here. The UAE regulator's listing is licensing, not evidence of operating availability.",
                        "Το Wynn Al Marjan Island δεν έχει ανοίξει. Δεν δεχόμαστε αιτήματα ταξιδιού για λειτουργούν καζίνο στα ΗΑΕ. Η άδεια δεν σημαίνει ότι λειτουργεί.",
                      )}
                    </div>
                  )}
                  <small className="global-credit">
                    {d.photoPage && d.photoCreator && (
                      <>
                        <a
                          href={d.photoPage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("Photo", "Φωτογραφία")}: {d.photoCreator}
                        </a>{" "}
                        · {d.photoLicense} ·{" "}
                        {t("destination image", "εικόνα προορισμού")}
                      </>
                    )}
                    {!d.photoFile &&
                      t(
                        "Image pending rights-cleared source",
                        "Εκκρεμεί αδειοδοτημένη φωτογραφία",
                      )}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
        {destinations.length === 0 && (
          <p className="global-empty" role="status">
            {t("No matching destinations found", "Δεν βρέθηκαν προορισμοί")}
          </p>
        )}
        <div className="global-footer">
          <Link to="/">
            {t("← Back to homepage", "← Επιστροφή στην αρχική")}
          </Link>
          <Link to="/request">
            {t(
              "Plan a free travel enquiry",
              "Υποβολή δωρεάν αιτήματος ταξιδιού",
            )}{" "}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}
