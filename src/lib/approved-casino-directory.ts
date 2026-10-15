/**
 * 2026-10-15 user-approved Europe, Russia, United States and UAE travel directory.
 * This is an operator-sourced editorial index, not a contract or live inventory.
 * The operator links are primary references; operating hours, regulations and
 * customer travel eligibility must be rechecked before assisting a traveller.
 * Russia enquiries additionally require sanctions/travel-compliance review.
 */
import { globalVenues } from "./global-casino-catalog";
export type ApprovedName = [string, string];
export type CountryKind = "europe" | "international" | "planned";
export type ApprovedCountry = {
  slug: string;
  name: ApprovedName;
  flag: string;
  kind: CountryKind;
  image: string;
  imageCredit?: string;
  imageCreditUrl?: string;
};
export type ApprovedCasino = {
  id: string;
  countrySlug: string;
  name: string;
  locality: ApprovedName;
  officialUrl: string;
  status: "operator-listed" | "planned";
  sourceChecked: string;
  gaming: "casino" | "electronic-gaming" | "future-gaming";
};
const commons = (file: string) =>
  "https://commons.wikimedia.org/wiki/Special:FilePath/" +
  encodeURIComponent(file);
export const approvedCountries: ApprovedCountry[] = [
  {
    slug: "monaco",
    name: ["Monaco", "Μονακό"],
    flag: "🇲🇨",
    kind: "europe",
    image: "/design-reference/monaco.webp",
  },
  {
    slug: "cyprus",
    name: ["Cyprus", "Κύπρος"],
    flag: "🇨🇾",
    kind: "europe",
    image: "/design-reference/cyprus.webp",
  },
  {
    slug: "greece",
    name: ["Greece", "Ελλάδα"],
    flag: "🇬🇷",
    kind: "europe",
    image: "/design-reference/greece.webp",
  },
  {
    slug: "italy",
    name: ["Italy", "Ιταλία"],
    flag: "🇮🇹",
    kind: "europe",
    image: "/design-reference/italy.webp",
  },
  {
    slug: "france",
    name: ["France", "Γαλλία"],
    flag: "🇫🇷",
    kind: "europe",
    image: "/design-reference/france.webp",
  },
  {
    slug: "spain",
    name: ["Spain", "Ισπανία"],
    flag: "🇪🇸",
    kind: "europe",
    image: "/design-reference/spain.webp",
  },
  {
    slug: "portugal",
    name: ["Portugal", "Πορτογαλία"],
    flag: "🇵🇹",
    kind: "europe",
    image: "/design-reference/portugal.webp",
  },
  {
    slug: "serbia",
    name: ["Serbia", "Σερβία"],
    flag: "🇷🇸",
    kind: "europe",
    image: "/design-reference/serbia.webp",
  },
  {
    slug: "romania",
    name: ["Romania", "Ρουμανία"],
    flag: "🇷🇴",
    kind: "europe",
    image: "/design-reference/romania.webp",
  },
  {
    slug: "slovenia",
    name: ["Slovenia", "Σλοβενία"],
    flag: "🇸🇮",
    kind: "europe",
    image: "/design-reference/slovenia.webp",
  },
  {
    slug: "bulgaria",
    name: ["Bulgaria", "Βουλγαρία"],
    flag: "🇧🇬",
    kind: "europe",
    image: "/design-reference/bulgaria.webp",
  },
  {
    slug: "croatia",
    name: ["Croatia", "Κροατία"],
    flag: "🇭🇷",
    kind: "europe",
    image: "/design-reference/croatia.webp",
  },
  {
    slug: "usa",
    name: ["United States", "Ηνωμένες Πολιτείες"],
    flag: "🇺🇸",
    kind: "international",
    image: commons("Las Vegas Strip at night - panoramio.jpg"),
    imageCredit: "David Balmer · CC BY 3.0",
    imageCreditUrl:
      "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_at_night_-_panoramio.jpg",
  },
  {
    slug: "russia",
    name: ["Russia", "Ρωσία"],
    flag: "🇷🇺",
    kind: "international",
    image: commons("Krasnaya Polyana Mountains.JPG"),
    imageCredit: "Wikimedia Commons – Krasnaya Polyana Mountains",
    imageCreditUrl:
      "https://commons.wikimedia.org/wiki/File:Krasnaya_Polyana_Mountains.JPG",
  },
  {
    slug: "uae",
    name: ["United Arab Emirates", "Ηνωμένα Αραβικά Εμιράτα"],
    flag: "🇦🇪",
    kind: "planned",
    image: commons("Ras al khaimah mountains.jpg"),
    imageCredit: "Rafia aql · CC BY-SA 4.0",
    imageCreditUrl:
      "https://commons.wikimedia.org/wiki/File:Ras_al_khaimah_mountains.jpg",
  },
];
/** 33 Europe/Russia entries, in the EXACT user-approved country order. */
const approvedRegionalVenues: ApprovedCasino[] = [
  {
    id: "monaco-01",
    countrySlug: "monaco",
    name: "Casino de Monte-Carlo",
    locality: ["Monte Carlo", "Μόντε Κάρλο"],
    officialUrl: "https://www.montecarlosbm.com/en",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "monaco-02",
    countrySlug: "monaco",
    name: "Casino Café de Paris",
    locality: ["Monte Carlo", "Μόντε Κάρλο"],
    officialUrl: "https://www.montecarlosbm.com/en",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "cyprus-03",
    countrySlug: "cyprus",
    name: "City of Dreams Mediterranean",
    locality: ["Limassol", "Λεμεσός"],
    officialUrl: "https://www.cityofdreamsmed.com.cy/en/casino",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "cyprus-04",
    countrySlug: "cyprus",
    name: "C2 Nicosia",
    locality: ["Nicosia", "Λευκωσία"],
    officialUrl: "https://www.cityofdreamsmed.com.cy/en/casino",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "cyprus-05",
    countrySlug: "cyprus",
    name: "C2 Ayia Napa",
    locality: ["Ayia Napa", "Αγία Νάπα"],
    officialUrl: "https://www.cityofdreamsmed.com.cy/en/casino",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "cyprus-06",
    countrySlug: "cyprus",
    name: "C2 Paphos",
    locality: ["Paphos", "Πάφος"],
    officialUrl: "https://www.cityofdreamsmed.com.cy/en/casino",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "greece-07",
    countrySlug: "greece",
    name: "Regency Casino Mont Parnes",
    locality: ["Athens / Parnitha", "Αθήνα / Πάρνηθα"],
    officialUrl: "https://athens.regencycasinos.gr/en",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "greece-08",
    countrySlug: "greece",
    name: "Regency Casino Thessaloniki",
    locality: ["Thessaloniki", "Θεσσαλονίκη"],
    officialUrl: "https://thessaloniki.regencycasinos.gr/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "greece-09",
    countrySlug: "greece",
    name: "Club Hotel Casino Loutraki",
    locality: ["Loutraki", "Λουτράκι"],
    officialUrl: "https://www.casinoloutraki.gr/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "italy-10",
    countrySlug: "italy",
    name: "Casinò di Venezia – Ca’ Vendramin Calergi",
    locality: ["Venice / Ca’ Vendramin", "Βενετία / Κα’ Βεντραμίν"],
    officialUrl: "https://www.casinovenezia.it/en",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "italy-11",
    countrySlug: "italy",
    name: "Casinò di Venezia – Ca’ Noghera",
    locality: ["Venice / Ca’ Noghera", "Βενετία / Κα’ Νογκέρα"],
    officialUrl: "https://www.casinovenezia.it/en",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "italy-12",
    countrySlug: "italy",
    name: "Casinò di Sanremo",
    locality: ["Sanremo", "Σανρέμο"],
    officialUrl: "https://www.casinosanremo.it/en/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "france-13",
    countrySlug: "france",
    name: "Casino Barrière Enghien-les-Bains",
    locality: [
      "Enghien-les-Bains (Paris region)",
      "Ενγκιέν-λε-Μπεν (κοντά στο Παρίσι)",
    ],
    officialUrl: "https://www.casinosbarriere.com/en/enghien-les-bains",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "france-14",
    countrySlug: "france",
    name: "Casino Barrière Deauville",
    locality: ["Deauville", "Ντοβίλ"],
    officialUrl: "https://www.casinosbarriere.com/en/deauville",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "spain-15",
    countrySlug: "spain",
    name: "Casino Barcelona",
    locality: ["Barcelona", "Βαρκελώνη"],
    officialUrl: "https://www.casinobarcelona.com/en",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "spain-16",
    countrySlug: "spain",
    name: "Casino Gran Madrid Torrelodones",
    locality: ["Torrelodones (Madrid area)", "Τορελοδόνες (περιοχή Μαδρίτης)"],
    officialUrl: "https://casinogranmadrid.com/en/plan-your-visit",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "spain-17",
    countrySlug: "spain",
    name: "Casino Gran Madrid Colón",
    locality: ["Madrid / Colón", "Μαδρίτη / Κολόν"],
    officialUrl: "https://casinogranmadrid.com/en/plan-your-visit",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "spain-18",
    countrySlug: "spain",
    name: "Casino Torrequebrada",
    locality: ["Benalmádena / Málaga", "Μπεναλμάδενα / Μάλαγα"],
    officialUrl: "https://casinogranmadrid.com/en/torrequebrada",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "portugal-19",
    countrySlug: "portugal",
    name: "Casino Espinho",
    locality: ["Espinho (Porto area)", "Εσπίνιο (περιοχή Πόρτο)"],
    officialUrl: "https://www.casinonline.solverde.pt/contactos/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "portugal-20",
    countrySlug: "portugal",
    name: "Casino Vilamoura",
    locality: ["Vilamoura / Algarve", "Βιλαμούρα / Αλγκάρβε"],
    officialUrl: "https://www.casinonline.solverde.pt/contactos/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "portugal-21",
    countrySlug: "portugal",
    name: "Casino Monte Gordo",
    locality: ["Monte Gordo / Algarve", "Μόντε Γκόρντο / Αλγκάρβε"],
    officialUrl: "https://www.casinonline.solverde.pt/contactos/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "portugal-22",
    countrySlug: "portugal",
    name: "Hotel Casino Chaves",
    locality: ["Chaves", "Σάβες"],
    officialUrl: "https://www.casinonline.solverde.pt/contactos/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "serbia-23",
    countrySlug: "serbia",
    name: "Grand Casino Beograd",
    locality: ["Belgrade", "Βελιγράδι"],
    officialUrl: "https://www.grandcasinobeograd.com/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "romania-24",
    countrySlug: "romania",
    name: "Platinum Casino",
    locality: ["Bucharest", "Βουκουρέστι"],
    officialUrl: "https://theplatinumcasino.ro/en/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "slovenia-25",
    countrySlug: "slovenia",
    name: "Perla Resort & Entertainment",
    locality: ["Nova Gorica", "Νόβα Γκόριτσα"],
    officialUrl: "https://www.hit.si/en/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "slovenia-26",
    countrySlug: "slovenia",
    name: "Park Hotel & Entertainment",
    locality: ["Nova Gorica", "Νόβα Γκόριτσα"],
    officialUrl: "https://www.hit.si/en/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "slovenia-27",
    countrySlug: "slovenia",
    name: "Mond Resort & Entertainment",
    locality: ["Šentilj", "Σέντιλι"],
    officialUrl: "https://www.hit.si/en/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "slovenia-28",
    countrySlug: "slovenia",
    name: "Korona Resort & Entertainment",
    locality: ["Kranjska Gora", "Κράνσκα Γκόρα"],
    officialUrl: "https://www.hit.si/en/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "bulgaria-29",
    countrySlug: "bulgaria",
    name: "Palms Royale Casino Sofia",
    locality: ["Sofia", "Σόφια"],
    officialUrl: "https://www.palmsroyalesofia.com/en",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "croatia-30",
    countrySlug: "croatia",
    name: "Casino Mulino",
    locality: ["Buje / Istria", "Μπούγε / Ίστρια"],
    officialUrl: "https://mulino.hr/casino/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "russia-31",
    countrySlug: "russia",
    name: "Casino Sochi",
    locality: ["Sochi / Krasnaya Polyana", "Σότσι / Κράσναγια Πολιάνα"],
    officialUrl: "https://en.krasnayapolyana.game/place/casinosochi",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "russia-32",
    countrySlug: "russia",
    name: "Sobranie Casino",
    locality: ["Kaliningrad / Yantarnaya", "Καλίνινγκραντ / Γιανταρνάγια"],
    officialUrl: "https://www.sobranie-casino.com/en/",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
  {
    id: "russia-33",
    countrySlug: "russia",
    name: "Shambala Casino & Hotel",
    locality: ["Primorye / Vladivostok", "Πριμόριε / Βλαδιβοστόκ"],
    officialUrl: "https://www.shambalacasino.ru/main-eng",
    status: "operator-listed",
    gaming: "casino",
    sourceChecked: "2026-10-15",
  },
];
export const approvedUnitedStatesVenues: ApprovedCasino[] = globalVenues
  .filter((v) => v.country === "US" && v.status === "operating")
  .map((v) => ({
    id: v.id,
    countrySlug: "usa",
    name: v.name,
    locality: [v.locality, v.locality],
    officialUrl: v.officialUrl,
    status: "operator-listed",
    sourceChecked: v.sourceChecked,
    gaming: v.gaming === "electronic-gaming" ? "electronic-gaming" : "casino",
  }));
export const approvedUaeFuture: ApprovedCasino[] = globalVenues
  .filter((v) => v.country === "AE" && v.status === "planned")
  .map((v) => ({
    id: v.id,
    countrySlug: "uae",
    name: v.name,
    locality: [v.locality, v.locality],
    officialUrl: v.officialUrl,
    status: "planned",
    sourceChecked: v.sourceChecked,
    gaming: "future-gaming",
  }));
export const approvedCasinoDirectory: ApprovedCasino[] = [
  ...approvedRegionalVenues,
  ...approvedUnitedStatesVenues,
  ...approvedUaeFuture,
];
export const approvedOperatingCandidates = approvedCasinoDirectory.filter(
  (v) => v.status !== "planned",
);
export const findApprovedCountry = (slug: string) =>
  approvedCountries.find((c) => c.slug === slug);
export const countryVenues = (slug: string) =>
  approvedCasinoDirectory.filter((v) => v.countrySlug === slug);
export const approvedTotals = {
  countries: approvedCountries.length,
  activeCandidates: approvedOperatingCandidates.length,
  planned: approvedCasinoDirectory.filter((v) => v.status === "planned").length,
};
