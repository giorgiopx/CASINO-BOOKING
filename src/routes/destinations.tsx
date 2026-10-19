import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCasino } from "@/components/casino/context";
import { editorialImageAlt, editorialImageNotice } from "@/lib/visual-assets";
import { DestinationImage } from "@/components/casino/destination-image";
import {
  approvedTotals,
  isRequestableVenue,
  searchApprovedDirectory,
  type DirectoryFilter,
} from "@/lib/approved-casino-directory";
import { casinoHead } from "@/lib/casino-seo";
import "./destinations-directory.css";

export const Route = createFileRoute("/destinations")({
  head: () =>
    casinoHead(
      "15 countries & casino destinations | CasinoBooking.com",
      "Explore a curated directory of 51 operator-listed casino and gaming venues in 14 countries, plus one planned UAE project. No live bookings or confirmed partnerships.",
    ),
  component: ApprovedDestinations,
});

function ApprovedDestinations() {
  const { lang, t } = useCasino();
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<DirectoryFilter>("all");
  const results = useMemo(
    () => searchApprovedDirectory(search, group),
    [search, group],
  );
  const resultCount = results.reduce(
    (total, { venues }) => total + venues.length,
    0,
  );
  const plannedCount = results.reduce(
    (total, { venues }) =>
      total + venues.filter((venue) => venue.status === "planned").length,
    0,
  );

  return (
    <main className="approved-directory">
      <header className="approved-hero">
        <div className="approved-container">
          <p className="approved-eyebrow">
            CASINOBOOKING.COM ·{" "}
            {t("CURATED DESTINATIONS", "ΕΠΙΛΕΓΜΕΝΟΙ ΠΡΟΟΡΙΣΜΟΙ")}
          </p>
          <h1>
            {t(
              "Explore the casino destination directory",
              "Κατάλογος προορισμών καζίνο",
            )}
          </h1>
          <p>
            {t(
              "Explore operator-sourced venue information and request free, personal travel coordination. CasinoBooking does not claim partnerships, real-time availability, or confirmed reservations.",
              "Ανακάλυψε καζίνο από πληροφορίες διαχειριστών και ζήτησε δωρεάν προσωπική ταξιδιωτική υποστήριξη. Δεν δηλώνουμε συνεργασίες, διαθεσιμότητα σε πραγματικό χρόνο ή επιβεβαιωμένες κρατήσεις.",
            )}
          </p>
          <div
            className="approved-stats"
            aria-label={t("Directory totals", "Σύνολα καταλόγου")}
          >
            <span>
              <strong>{approvedTotals.countries}</strong>{" "}
              {t("countries", "χώρες")}
            </span>
            <span>
              <strong>{approvedTotals.activeCandidates}</strong>{" "}
              {t("operator-listed venues", "καταχωρισμένοι χώροι")}
            </span>
            <span>
              <strong>{approvedTotals.planned}</strong>{" "}
              {t("planned project", "μελλοντικό έργο")}
            </span>
          </div>
        </div>
      </header>
      <section className="approved-container approved-main">
        <div className="approved-search">
          <label htmlFor="approved-find">
            {t(
              "Find a country, city or venue",
              "Αναζήτηση χώρας, πόλης ή καζίνο",
            )}
          </label>
          <input
            id="approved-find"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t(
              "e.g. Monaco, Limassol, Bellagio",
              "π.χ. Μονακό, Λεμεσός, Bellagio",
            )}
          />
          <div
            className="approved-filters"
            aria-label={t("Directory filters", "Φίλτρα καταλόγου")}
          >
            {(
              [
                ["all", "All", "Όλα"],
                ["europe", "Europe", "Ευρώπη"],
                ["international", "International", "Διεθνή"],
                ["planned", "Planned only", "Μόνο μελλοντικά"],
                ["restricted", "Information only", "Μόνο πληροφορίες"],
              ] as const
            ).map(([value, en, el]) => (
              <button
                type="button"
                key={value}
                aria-pressed={group === value}
                onClick={() => setGroup(value)}
              >
                {t(en, el)}
              </button>
            ))}
          </div>
        </div>
        <p className="approved-caution">
          {t(
            "Directory entries are research candidates, not confirmation that every venue is currently operating. Verify licensing, eligibility, legal age and opening status with the operator and local authority before any trip. Russian entries are information only; travel enquiries are unavailable pending sanctions and travel-compliance review. Wynn Al Marjan (UAE) is planned and cannot be booked.",
            "Οι καταχωρίσεις είναι υποψήφιοι προορισμοί έρευνας, όχι βεβαίωση ότι όλοι λειτουργούν σήμερα. Επιβεβαίωσε άδειες, προϋποθέσεις, νόμιμη ηλικία και λειτουργία με τον διαχειριστή και τις αρχές. Οι καταχωρίσεις της Ρωσίας είναι μόνο ενημερωτικές· δεν δεχόμαστε ταξιδιωτικά αιτήματα πριν τον έλεγχο κυρώσεων και ταξιδιωτικής συμμόρφωσης. Το Wynn Al Marjan (ΗΑΕ) είναι μελλοντικό έργο χωρίς κρατήσεις.",
          )}
        </p>
        <div className="approved-result-summary">
          <p role="status" aria-live="polite">
            {results.length} {t("countries", "χώρες")} ·{" "}
            {resultCount - plannedCount}{" "}
            {t("operator-listed venues", "καταχωρισμένοι χώροι")} ·{" "}
            {plannedCount} {t("planned projects", "μελλοντικά έργα")}
          </p>
          {(search || group !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setGroup("all");
              }}
            >
              {t("Clear filters", "Καθαρισμός φίλτρων")}
            </button>
          )}
          <Link to="/global-casinos">
            {t("US regional guides →", "Περιφερειακοί οδηγοί ΗΠΑ →")}
          </Link>
        </div>
        {results.length === 0 && (
          <p role="status">
            {t(
              "No matches. Try another search.",
              "Δεν βρέθηκαν αποτελέσματα. Δοκίμασε άλλη αναζήτηση.",
            )}
          </p>
        )}
        <div className="approved-country-list">
          {results.map(({ country, venues }) => (
            <section key={country.slug} className="approved-country">
              <div className="approved-country-heading">
                <Link
                  to="/destination/$slug"
                  params={{ slug: country.slug }}
                  className="approved-country-photo"
                >
                  <DestinationImage
                    src={country.image}
                    alt={
                      t(country.name[0], country.name[1]) +
                      t(...editorialImageAlt)
                    }
                  />
                </Link>
                <div className="approved-country-flag" aria-hidden="true">
                  {country.flag}
                </div>
                <div>
                  <p className="approved-country-overline">
                    {country.kind === "planned"
                      ? t("Future development", "Μελλοντικό έργο")
                      : country.slug === "russia"
                        ? t(
                            "Information only · travel restricted",
                            "Μόνο πληροφορίες · ταξιδιωτικοί περιορισμοί",
                          )
                        : t(
                            "Independent destination index",
                            "Ανεξάρτητος κατάλογος",
                          )}
                  </p>
                  <h2>
                    <Link
                      to="/destination/$slug"
                      params={{ slug: country.slug }}
                    >
                      {country.name[lang === "el" ? 1 : 0]} →
                    </Link>
                  </h2>
                  <small>
                    {venues.length}{" "}
                    {country.kind === "planned"
                      ? t("planned project", "μελλοντικό έργο")
                      : t("listed venues", "καταχωρίσεις")}
                  </small>
                </div>
              </div>
              <ul className="approved-venues">
                {venues.map((venue) => (
                  <li key={venue.id}>
                    <div>
                      <h3>{venue.name}</h3>
                      <p>{venue.locality[lang === "el" ? 1 : 0]}</p>
                      <span
                        className={
                          venue.status === "planned"
                            ? "approved-planned"
                            : "approved-listed"
                        }
                      >
                        {venue.status === "planned"
                          ? t(
                              "Planned · not open",
                              "Μελλοντικό · δεν λειτουργεί",
                            )
                          : country.slug === "russia"
                            ? t(
                                "Information only · no travel enquiries",
                                "Μόνο πληροφορίες · χωρίς ταξιδιωτικά αιτήματα",
                              )
                            : t(
                                "Operator-listed · verify status",
                                "Καταχώριση διαχειριστή · έλεγξε λειτουργία",
                              )}
                      </span>
                      {venue.gaming === "electronic-gaming" && (
                        <p>
                          {t(
                            "Electronic gaming venue",
                            "Χώρος ηλεκτρονικών παιχνιδιών",
                          )}
                        </p>
                      )}
                      <small className="approved-checked">
                        {t("Source checked", "Έλεγχος πηγής")}:{" "}
                        {venue.sourceChecked}
                      </small>
                    </div>
                    <div className="approved-actions">
                      <a
                        href={venue.officialUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t("Official source ↗", "Επίσημη πηγή ↗")}
                      </a>
                      {isRequestableVenue(venue) && (
                        <Link to="/request" search={{ interest: venue.name }}>
                          {t("Send enquiry →", "Αποστολή αιτήματος →")}
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="approved-photo-credit">
                {t(...editorialImageNotice)}
              </p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
