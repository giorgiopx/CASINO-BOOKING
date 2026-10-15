import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCasino } from "@/components/casino/context";
import {
  approvedCountries,
  approvedTotals,
  countryVenues,
  type CountryKind,
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

type Group = "all" | CountryKind;

function ApprovedDestinations() {
  const { lang, t } = useCasino();
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<Group>("all");
  const results = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return approvedCountries
      .filter((country) => group === "all" || country.kind === group)
      .map((country) => {
        const venues = countryVenues(country.slug);
        const countryMatches = country.name
          .join(" ")
          .toLocaleLowerCase()
          .includes(term);
        return {
          country,
          venues:
            term && !countryMatches
              ? venues.filter((venue) =>
                  (venue.name + " " + venue.locality.join(" "))
                    .toLocaleLowerCase()
                    .includes(term),
                )
              : venues,
        };
      })
      .filter(({ venues }) => venues.length > 0);
  }, [search, group]);

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
            "Directory entries are research candidates, not confirmation that every venue is currently operating. Verify licensing, eligibility, legal age and opening status with the operator and local authority before any trip. Russian destinations require sanctions and travel-compliance review. Wynn Al Marjan (UAE) is planned and cannot be booked.",
            "Οι καταχωρίσεις είναι υποψήφιοι προορισμοί έρευνας, όχι βεβαίωση ότι όλοι λειτουργούν σήμερα. Επιβεβαίωσε άδειες, προϋποθέσεις, νόμιμη ηλικία και λειτουργία με τον διαχειριστή και τις αρχές. Για τη Ρωσία απαιτείται έλεγχος κυρώσεων και ταξιδιωτικής συμμόρφωσης. Το Wynn Al Marjan (ΗΑΕ) είναι μελλοντικό έργο χωρίς κρατήσεις.",
          )}
        </p>
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
              <div className="approved-country-heading"><Link to="/destination/$slug" params={{ slug: country.slug }} className="approved-country-photo"><img src={country.image} alt={t(country.name[0],country.name[1]) + " — editorial destination photograph"} loading="lazy" onError={e=>{e.currentTarget.hidden=true}} /></Link>
                <div className="approved-country-flag" aria-hidden="true">
                  {country.flag}
                </div>
                <div>
                  <p className="approved-country-overline">
                    {country.kind === "planned"
                      ? t("Future development", "Μελλοντικό έργο")
                      : t(
                          "Independent destination index",
                          "Ανεξάρτητος κατάλογος",
                        )}
                  </p>
                  <h2><Link to="/destination/$slug" params={{ slug: country.slug }}>{country.name[lang === "el" ? 1 : 0]} →</Link></h2>
                  <small>
                    {venues.length} {t("listed venues", "καταχωρίσεις")}
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
                          : t(
                              "Operator-listed · verify status",
                              "Καταχώριση διαχειριστή · έλεγξε λειτουργία",
                            )}
                      </span>
                    </div>
                    <div className="approved-actions">
                      <a
                        href={venue.officialUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {t("Official source ↗", "Επίσημη πηγή ↗")}
                      </a>
                      {venue.status !== "planned" &&
                        country.slug !== "russia" && (
                          <Link to="/request" search={{ interest: venue.name }}>
                            {t("Send enquiry →", "Αποστολή αιτήματος →")}
                          </Link>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
              {country.imageCredit && country.imageCreditUrl && (
                <small className="approved-source">
                  {t("Destination photo source", "Πηγή φωτογραφίας προορισμού")}
                  :{" "}
                  <a
                    href={country.imageCreditUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {country.imageCredit}
                  </a>
                </small>
              )}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
