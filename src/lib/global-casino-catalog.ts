/**
 * Curated United States casino-resort catalogue, operator-source research on 2026-10-14.
 * This data is independent discovery, NOT proof of partnership or bookable inventory.
 * The single UAE entry is future/planned: never include in active travel offers.
 * Destination art is locally generated editorial illustration, not venue photography.
 */
import { renderedImage } from "./visual-assets";
export type GlobalCasinoVenue = {
  id: string;
  name: string;
  locality: string;
  localityEl: string;
  state: string;
  stateEl: string;
  country: "US" | "AE";
  officialUrl: string;
  status: "operating" | "planned";
  accommodation: "on-site" | "nearby";
  gaming: "casino" | "electronic-gaming" | "future-gaming";
  sourceChecked: string;
  notes: [string, string];
};
export type GlobalDestination = {
  slug: string;
  name: [string, string];
  subtitle: [string, string];
  country: "US" | "AE";
  state: string;
  stateEl: string;
  photoFile: string | null;
  photoCreator: string | null;
  photoLicense: string | null;
  photoPage: string | null;
  venueIds: string[];
};

export const globalVenues: GlobalCasinoVenue[] = [
  {
    id: "bellagio",
    name: "Bellagio Las Vegas",
    locality: "Las Vegas",
    localityEl: "Λας Βέγκας",
    state: "Nevada",
    stateEl: "Νεβάδα",
    country: "US",
    officialUrl: "https://bellagio.mgmresorts.com/en.html",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Luxury casino hotel on the Las Vegas Strip.",
      "Πολυτελές ξενοδοχείο-καζίνο στη Las Vegas Strip.",
    ],
  },
  {
    id: "wynn-las-vegas",
    name: "Wynn Las Vegas & Encore",
    locality: "Las Vegas",
    localityEl: "Λας Βέγκας",
    state: "Nevada",
    stateEl: "Νεβάδα",
    country: "US",
    officialUrl: "https://www.wynnlasvegas.com/casino",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "High-end resort hotels and casino floors.",
      "Πολυτελή ξενοδοχεία με χώρους καζίνο.",
    ],
  },
  {
    id: "venetian",
    name: "The Venetian Resort & The Palazzo",
    locality: "Las Vegas",
    localityEl: "Λας Βέγκας",
    state: "Nevada",
    stateEl: "Νεβάδα",
    country: "US",
    officialUrl: "https://www.venetianlasvegas.com/resort/casino.html",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Luxury all-suite resort with Venetian and Palazzo casinos.",
      "Πολυτελές θέρετρο με καζίνο Venetian και Palazzo.",
    ],
  },
  {
    id: "hard-rock-hollywood",
    name: "Seminole Hard Rock Hotel & Casino Hollywood",
    locality: "Hollywood (near Miami)",
    localityEl: "Χόλιγουντ (κοντά στο Μαϊάμι)",
    state: "Florida",
    stateEl: "Φλόριντα",
    country: "US",
    officialUrl: "https://casino.hardrock.com/hollywood",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Guitar-shaped hotel and casino near Miami, not in downtown Miami.",
      "Ξενοδοχείο και καζίνο στο Hollywood της Φλόριντα, κοντά στο Μαϊάμι.",
    ],
  },
  {
    id: "hard-rock-tampa",
    name: "Seminole Hard Rock Hotel & Casino Tampa",
    locality: "Tampa",
    localityEl: "Τάμπα",
    state: "Florida",
    stateEl: "Φλόριντα",
    country: "US",
    officialUrl: "https://casino.hardrock.com/tampa",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Casino hotel and dining in Tampa.",
      "Ξενοδοχείο-καζίνο με εστίαση στην Τάμπα.",
    ],
  },
  {
    id: "pechanga",
    name: "Pechanga Resort Casino",
    locality: "Temecula",
    localityEl: "Τεμέκουλα",
    state: "California",
    stateEl: "Καλιφόρνια",
    country: "US",
    officialUrl: "https://www.pechanga.com/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Large resort casino in Temecula wine country.",
      "Μεγάλο ξενοδοχειακό συγκρότημα καζίνο στην Τεμέκουλα.",
    ],
  },
  {
    id: "yaamava",
    name: "Yaamava' Resort & Casino at San Manuel",
    locality: "Highland",
    localityEl: "Χάιλαντ",
    state: "California",
    stateEl: "Καλιφόρνια",
    country: "US",
    officialUrl: "https://www.yaamava.com/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Resort casino in the San Bernardino region.",
      "Casino resort στην περιοχή Σαν Μπερναρντίνο.",
    ],
  },
  {
    id: "morongo",
    name: "Morongo Casino Resort & Spa",
    locality: "Cabazon",
    localityEl: "Καμπαζόν",
    state: "California",
    stateEl: "Καλιφόρνια",
    country: "US",
    officialUrl: "https://www.morongocasinoresort.com/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Casino and hotel near Palm Springs.",
      "Καζίνο και ξενοδοχείο κοντά στο Παλμ Σπρινγκς.",
    ],
  },
  {
    id: "thunder-valley",
    name: "Thunder Valley Casino Resort",
    locality: "Lincoln (Sacramento region)",
    localityEl: "Λίνκολν (περιοχή Σακραμέντο)",
    state: "California",
    stateEl: "Καλιφόρνια",
    country: "US",
    officialUrl: "https://www.thundervalleyresort.com/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Casino hotel near Sacramento.",
      "Ξενοδοχείο-καζίνο κοντά στο Σακραμέντο.",
    ],
  },
  {
    id: "resorts-world-nyc",
    name: "Resorts World New York City",
    locality: "Queens, New York City",
    localityEl: "Κουίνς, Νέα Υόρκη",
    state: "New York",
    stateEl: "Νέα Υόρκη",
    country: "US",
    officialUrl: "https://rwnewyork.com/about/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Operating full casino in Queens with live table games opened April 28, 2026; adjacent Hyatt Regency JFK Airport hotel.",
      "Καζίνο σε λειτουργία στο Κουίνς με επιτραπέζια παιχνίδια από 28 Απριλίου 2026 και γειτονικό Hyatt Regency JFK Airport.",
    ],
  },
  {
    id: "empire-city",
    name: "Empire City Casino at Yonkers Raceway",
    locality: "Yonkers (NYC area)",
    localityEl: "Γιόνκερς (περιοχή Νέας Υόρκης)",
    state: "New York",
    stateEl: "Νέα Υόρκη",
    country: "US",
    officialUrl: "https://empirecitycasino.mgmresorts.com/en.html",
    status: "operating",
    accommodation: "nearby",
    gaming: "electronic-gaming",
    sourceChecked: "2026-10-14",
    notes: [
      "Gaming/racetrack facility north of Manhattan, not a central Manhattan hotel.",
      "Χώρος ηλεκτρονικών παιχνιδιών στο Γιόνκερς, βόρεια του Μανχάταν.",
    ],
  },
  {
    id: "borgata",
    name: "Borgata Hotel Casino & Spa",
    locality: "Atlantic City",
    localityEl: "Ατλάντικ Σίτι",
    state: "New Jersey",
    stateEl: "Νιου Τζέρσεϊ",
    country: "US",
    officialUrl: "https://borgata.mgmresorts.com/en.html",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Atlantic City marina-district casino resort and hotel.",
      "Casino resort και ξενοδοχείο στο Atlantic City.",
    ],
  },
  {
    id: "hard-rock-atlantic-city",
    name: "Hard Rock Hotel & Casino Atlantic City",
    locality: "Atlantic City",
    localityEl: "Ατλάντικ Σίτι",
    state: "New Jersey",
    stateEl: "Νιου Τζέρσεϊ",
    country: "US",
    officialUrl: "https://casino.hardrock.com/atlantic-city/hotel-and-casino",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Boardwalk casino hotel and entertainment complex.",
      "Ξενοδοχείο-καζίνο στο Boardwalk του Atlantic City.",
    ],
  },
  {
    id: "mohegan-sun",
    name: "Mohegan Sun",
    locality: "Uncasville",
    localityEl: "Ανκασβιλ",
    state: "Connecticut",
    stateEl: "Κονέκτικατ",
    country: "US",
    officialUrl: "https://mohegansun.com/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Large casino resort with hotel and arena.",
      "Μεγάλο casino resort με ξενοδοχείο και εκδηλώσεις.",
    ],
  },
  {
    id: "foxwoods",
    name: "Foxwoods Resort Casino",
    locality: "Mashantucket",
    localityEl: "Μασαντάκετ",
    state: "Connecticut",
    stateEl: "Κονέκτικατ",
    country: "US",
    officialUrl: "https://foxwoods.com/hotels",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Integrated casino resort with three hotel towers.",
      "Casino resort με τρεις ξενοδοχειακούς πύργους.",
    ],
  },
  {
    id: "mgm-national-harbor",
    name: "MGM National Harbor",
    locality: "Oxon Hill (Washington DC area)",
    localityEl: "Όξον Χιλ (περιοχή Ουάσινγκτον)",
    state: "Maryland",
    stateEl: "Μέριλαντ",
    country: "US",
    officialUrl: "https://mgmnationalharbor.mgmresorts.com/en.html",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Casino hotel on the Potomac, just outside Washington DC.",
      "Ξενοδοχείο-καζίνο στον Ποτόμακ, έξω από την Ουάσινγκτον.",
    ],
  },
  {
    id: "beau-rivage",
    name: "Beau Rivage Resort & Casino",
    locality: "Biloxi",
    localityEl: "Μπιλόξι",
    state: "Mississippi",
    stateEl: "Μισισίπι",
    country: "US",
    officialUrl: "https://beaurivage.mgmresorts.com/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Waterfront casino resort on the Mississippi Gulf Coast.",
      "Παραθαλάσσιο casino resort στον Κόλπο του Μισισίπι.",
    ],
  },
  {
    id: "choctaw-durant",
    name: "Choctaw Casino & Resort – Durant",
    locality: "Durant",
    localityEl: "Ντουράντ",
    state: "Oklahoma",
    stateEl: "Οκλαχόμα",
    country: "US",
    officialUrl: "https://www.choctawcasinos.com/durant/",
    status: "operating",
    accommodation: "on-site",
    gaming: "casino",
    sourceChecked: "2026-10-14",
    notes: [
      "Large casino resort with multiple hotel towers.",
      "Μεγάλο casino resort με πολλαπλούς ξενοδοχειακούς πύργους.",
    ],
  },
  {
    id: "wynn-al-marjan",
    name: "Wynn Al Marjan Island",
    locality: "Ras Al Khaimah",
    localityEl: "Ρας Αλ Χάιμα",
    state: "Ras Al Khaimah",
    stateEl: "Ρας Αλ Χάιμα",
    country: "AE",
    officialUrl: "https://www.newsroom.wynnresorts.com/en/wynnalmarjan/",
    status: "planned",
    accommodation: "on-site",
    gaming: "future-gaming",
    sourceChecked: "2026-10-14",
    notes: [
      "Licensed construction project, expected to open in 2027. NOT operational, no casino travel enquiries yet.",
      "Αδειοδοτημένο έργο υπό κατασκευή, αναμενόμενο το 2027. ΔΕΝ λειτουργεί ως καζίνο.",
    ],
  },
];

export const globalDestinations: GlobalDestination[] = [
  {
    slug: "las-vegas",
    name: ["Las Vegas · Nevada", "Λας Βέγκας · Νεβάδα"],
    subtitle: [
      "Legendary casino resorts and hotels on the Strip.",
      "Εμβληματικά casino resorts στη Strip.",
    ],
    country: "US",
    state: "Nevada",
    stateEl: "Νεβάδα",
    photoFile: renderedImage("region-las-vegas"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["bellagio", "wynn-las-vegas", "venetian"],
  },
  {
    slug: "miami",
    name: ["Miami area · South Florida", "Περιοχή Μαϊάμι · Φλόριντα"],
    subtitle: [
      "Casino travel in Hollywood, near Miami.",
      "Casino resort στο Hollywood, κοντά στο Μαϊάμι.",
    ],
    country: "US",
    state: "Florida",
    stateEl: "Φλόριντα",
    photoFile: renderedImage("region-miami"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["hard-rock-hollywood"],
  },
  {
    slug: "tampa",
    name: ["Tampa · Florida", "Τάμπα · Φλόριντα"],
    subtitle: [
      "Florida Gulf Coast casino resort.",
      "Casino resort στη δυτική Φλόριντα.",
    ],
    country: "US",
    state: "Florida",
    stateEl: "Φλόριντα",
    photoFile: renderedImage("region-tampa"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["hard-rock-tampa"],
  },
  {
    slug: "southern-california",
    name: ["Southern California", "Νότια Καλιφόρνια"],
    subtitle: [
      "Temecula, Cabazon and Highland casino resorts.",
      "Casino resorts σε Temecula, Cabazon και Highland.",
    ],
    country: "US",
    state: "California",
    stateEl: "Καλιφόρνια",
    photoFile: renderedImage("region-southern-california"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["pechanga", "yaamava", "morongo"],
  },
  {
    slug: "northern-california",
    name: ["Sacramento region · California", "Περιοχή Σακραμέντο · Καλιφόρνια"],
    subtitle: [
      "Casino hotel in Northern California.",
      "Casino resort στη Βόρεια Καλιφόρνια.",
    ],
    country: "US",
    state: "California",
    stateEl: "Καλιφόρνια",
    photoFile: renderedImage("region-northern-california"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["thunder-valley"],
  },
  {
    slug: "new-york",
    name: ["New York City region", "Περιοχή Νέας Υόρκης"],
    subtitle: [
      "Queens full casino and Yonkers electronic gaming facility.",
      "Καζίνο στο Κουίνς και ηλεκτρονικά παιχνίδια στο Γιόνκερς.",
    ],
    country: "US",
    state: "New York",
    stateEl: "Νέα Υόρκη",
    photoFile: renderedImage("region-new-york"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["resorts-world-nyc", "empire-city"],
  },
  {
    slug: "atlantic-city",
    name: ["Atlantic City · New Jersey", "Ατλάντικ Σίτι · Νιου Τζέρσεϊ"],
    subtitle: [
      "Boardwalk, marina hotels and casinos.",
      "Casino hotels στην παραλία και στη μαρίνα.",
    ],
    country: "US",
    state: "New Jersey",
    stateEl: "Νιου Τζέρσεϊ",
    photoFile: renderedImage("region-atlantic-city"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["borgata", "hard-rock-atlantic-city"],
  },
  {
    slug: "connecticut",
    name: ["Connecticut casino resorts", "Casino resorts στο Κονέκτικατ"],
    subtitle: [
      "Large casino hotels in Uncasville and Mashantucket.",
      "Μεγάλα casino resorts σε Uncasville και Mashantucket.",
    ],
    country: "US",
    state: "Connecticut",
    stateEl: "Κονέκτικατ",
    photoFile: renderedImage("region-connecticut"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["mohegan-sun", "foxwoods"],
  },
  {
    slug: "national-harbor",
    name: ["Washington DC area · Maryland", "Περιοχή Ουάσινγκτον · Μέριλαντ"],
    subtitle: [
      "Riverside casino resort at National Harbor.",
      "Παραποτάμιο casino resort στο National Harbor.",
    ],
    country: "US",
    state: "Maryland",
    stateEl: "Μέριλαντ",
    photoFile: renderedImage("region-national-harbor"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["mgm-national-harbor"],
  },
  {
    slug: "biloxi",
    name: ["Biloxi · Mississippi", "Μπιλόξι · Μισισίπι"],
    subtitle: [
      "Mississippi Gulf Coast casino resort.",
      "Παραθαλάσσιο casino resort στον Μισισίπι.",
    ],
    country: "US",
    state: "Mississippi",
    stateEl: "Μισισίπι",
    photoFile: renderedImage("region-biloxi"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["beau-rivage"],
  },
  {
    slug: "durant",
    name: ["Durant · Oklahoma", "Ντουράντ · Οκλαχόμα"],
    subtitle: [
      "Large integrated casino and hotel complex.",
      "Μεγάλο συγκρότημα καζίνο και ξενοδοχείων.",
    ],
    country: "US",
    state: "Oklahoma",
    stateEl: "Οκλαχόμα",
    photoFile: renderedImage("region-durant"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["choctaw-durant"],
  },
  {
    slug: "ras-al-khaimah",
    name: ["Ras Al Khaimah · UAE", "Ρας Αλ Χάιμα · ΗΑΕ"],
    subtitle: [
      "Future project only: Wynn Al Marjan scheduled for 2027.",
      "Μόνο μελλοντικό έργο: Wynn Al Marjan αναμένεται το 2027.",
    ],
    country: "AE",
    state: "Ras Al Khaimah",
    stateEl: "Ρας Αλ Χάιμα",
    photoFile: renderedImage("uae"),
    photoCreator: "OpenAI Image Generation",
    photoLicense: "AI-generated editorial illustration",
    photoPage: null,
    venueIds: ["wynn-al-marjan"],
  },
];
export function photoUrl(destination: GlobalDestination): string | null {
  return destination.photoFile ? destination.photoFile : null;
}
export const operatingGlobalVenues = globalVenues.filter(
  (v) => v.status === "operating",
);

export type GlobalCasinoHotel = {
  venueId: string;
  hotelName: string;
  officialHotelUrl: string;
  location: "on-site" | "adjacent" | "nearby";
};
/** Hotel sources are operator/hotel official pages; no room inventory or rates are integrated. */
export const globalCasinoHotels: GlobalCasinoHotel[] = [
  {
    venueId: "bellagio",
    hotelName: "Bellagio Las Vegas Hotel",
    officialHotelUrl: "https://bellagio.mgmresorts.com/en.html",
    location: "on-site",
  },
  {
    venueId: "wynn-las-vegas",
    hotelName: "Wynn Las Vegas & Encore Hotels",
    officialHotelUrl: "https://www.wynnlasvegas.com/",
    location: "on-site",
  },
  {
    venueId: "venetian",
    hotelName: "The Venetian & The Palazzo Suites",
    officialHotelUrl: "https://www.venetianlasvegas.com/",
    location: "on-site",
  },
  {
    venueId: "hard-rock-hollywood",
    hotelName: "The Guitar Hotel / Oasis Tower",
    officialHotelUrl: "https://casino.hardrock.com/hollywood",
    location: "on-site",
  },
  {
    venueId: "hard-rock-tampa",
    hotelName: "Seminole Hard Rock Hotel Tampa",
    officialHotelUrl: "https://casino.hardrock.com/tampa/hotel",
    location: "on-site",
  },
  {
    venueId: "pechanga",
    hotelName: "Pechanga Resort Hotel",
    officialHotelUrl: "https://www.pechanga.com/stay",
    location: "on-site",
  },
  {
    venueId: "yaamava",
    hotelName: "Yaamava' Resort Hotel",
    officialHotelUrl: "https://www.yaamava.com/",
    location: "on-site",
  },
  {
    venueId: "morongo",
    hotelName: "Morongo Resort Hotel",
    officialHotelUrl: "https://www.morongocasinoresort.com/",
    location: "on-site",
  },
  {
    venueId: "thunder-valley",
    hotelName: "Thunder Valley Resort Hotel",
    officialHotelUrl: "https://www.thundervalleyresort.com/hotel/rooms",
    location: "on-site",
  },
  {
    venueId: "resorts-world-nyc",
    hotelName: "Hyatt Regency JFK Airport at Resorts World New York",
    officialHotelUrl: "https://rwnewyork.com/hotel/",
    location: "adjacent",
  },
  {
    venueId: "empire-city",
    hotelName: "Hampton Inn & Suites Yonkers – Westchester / Area Hotels",
    officialHotelUrl:
      "https://empirecitycasino.mgmresorts.com/en/getting-here/area-hotels.html",
    location: "nearby",
  },
  {
    venueId: "borgata",
    hotelName: "Borgata Hotel & MGM Tower",
    officialHotelUrl: "https://borgata.mgmresorts.com/en.html",
    location: "on-site",
  },
  {
    venueId: "hard-rock-atlantic-city",
    hotelName: "Hard Rock Hotel Atlantic City",
    officialHotelUrl:
      "https://casino.hardrock.com/atlantic-city/hotel-and-casino",
    location: "on-site",
  },
  {
    venueId: "mohegan-sun",
    hotelName: "Mohegan Sun Hotel",
    officialHotelUrl: "https://mohegansun.com/",
    location: "on-site",
  },
  {
    venueId: "foxwoods",
    hotelName: "Grand Pequot Tower / Fox Tower / Great Cedar Hotel",
    officialHotelUrl: "https://foxwoods.com/hotels",
    location: "on-site",
  },
  {
    venueId: "mgm-national-harbor",
    hotelName: "MGM National Harbor Hotel",
    officialHotelUrl: "https://mgmnationalharbor.mgmresorts.com/en.html",
    location: "on-site",
  },
  {
    venueId: "beau-rivage",
    hotelName: "Beau Rivage Hotel",
    officialHotelUrl: "https://beaurivage.mgmresorts.com/en/hotel.html",
    location: "on-site",
  },
  {
    venueId: "choctaw-durant",
    hotelName: "Choctaw Durant Sky / Grand / Spa Tower Hotels",
    officialHotelUrl: "https://www.choctawcasinos.com/durant/stay/",
    location: "on-site",
  },
];

/** Search treats Greek accents and Latin accents consistently in both languages. */
export const normalizeDirectorySearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/ς/g, "σ")
    .trim();

export function searchGlobalDestinations(
  query: string,
  country: "US" | "AE" | "all" = "all",
) {
  const term = normalizeDirectorySearch(query);
  return globalDestinations
    .filter(
      (destination) => country === "all" || destination.country === country,
    )
    .map((destination) => {
      const areaMatches = normalizeDirectorySearch(
        [
          ...destination.name,
          destination.state,
          destination.stateEl,
          destination.country === "US"
            ? "USA United States ΗΠΑ Ηνωμένες Πολιτείες"
            : "UAE United Arab Emirates ΗΑΕ Ηνωμένα Αραβικά Εμιράτα",
        ].join(" "),
      ).includes(term);
      const venues = globalVenues.filter(
        (venue) =>
          destination.venueIds.includes(venue.id) &&
          (areaMatches ||
            normalizeDirectorySearch(
              [venue.name, venue.locality, venue.localityEl].join(" "),
            ).includes(term)),
      );
      return { destination, venues };
    })
    .filter(({ venues }) => venues.length > 0);
}
