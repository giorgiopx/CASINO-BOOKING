export type Lang = "en" | "el";
export type Pair = [string, string];
export const countries: Pair[] = [
  ["All destinations", "Όλοι οι προορισμοί"],
  ["Cyprus", "Κύπρος"],
  ["Slovenia", "Σλοβενία"],
  ["Greece", "Ελλάδα"],
  ["Bulgaria", "Βουλγαρία"],
];
export const casinos = [
  {
    id: "cod",
    name: "City of Dreams Mediterranean",
    country: 1,
    city: ["Limassol", "Λεμεσός"] as Pair,
    summary: [
      "A Mediterranean integrated resort with accommodation, dining and entertainment.",
      "Μεσογειακό συγκρότημα με διαμονή, εστίαση και ψυχαγωγία.",
    ] as Pair,
    tags: [
      ["Resort", "Θέρετρο"],
      ["Dining", "Εστίαση"],
      ["Spa", "Σπα"],
    ] as Pair[],
    url: "https://www.cityofdreamsmed.com.cy/en",
  },
  {
    id: "perla",
    name: "Perla Resort & Entertainment",
    country: 2,
    city: ["Nova Gorica", "Νόβα Γκόριτσα"] as Pair,
    summary: [
      "A resort and entertainment destination near the Slovenian–Italian border.",
      "Θέρετρο και προορισμός ψυχαγωγίας κοντά στα σύνορα Σλοβενίας–Ιταλίας.",
    ] as Pair,
    tags: [
      ["Hotel", "Ξενοδοχείο"],
      ["Dining", "Εστίαση"],
      ["Entertainment", "Ψυχαγωγία"],
    ] as Pair[],
    url: "https://perla-novagorica.com/en/",
  },
  {
    id: "porto",
    name: "Porto Carras Grand Resort",
    country: 3,
    city: ["Halkidiki", "Χαλκιδική"] as Pair,
    summary: [
      "A coastal resort destination on the Sithonia peninsula. Confirm current facilities directly.",
      "Παραθαλάσσιο θέρετρο στη Σιθωνία. Επιβεβαιώστε τις τρέχουσες παροχές απευθείας.",
    ] as Pair,
    tags: [
      ["Coastal resort", "Παραθαλάσσιο θέρετρο"],
      ["Marina", "Μαρίνα"],
      ["Dining", "Εστίαση"],
    ] as Pair[],
    url: "https://www.portocarras.com/",
  },
  {
    id: "hit",
    name: "HIT destinations",
    country: 2,
    city: ["Slovenia · multiple locations", "Σλοβενία · πολλαπλές τοποθεσίες"] as Pair,
    summary: [
      "Explore the HIT group’s Slovenian hospitality and entertainment destinations.",
      "Ανακαλύψτε προορισμούς φιλοξενίας και ψυχαγωγίας του ομίλου HIT στη Σλοβενία.",
    ] as Pair,
    tags: [
      ["Hotels", "Ξενοδοχεία"],
      ["Entertainment", "Ψυχαγωγία"],
    ] as Pair[],
    url: "https://www.hit.si/en",
  },
  {
    id: "golden",
    name: "GoldenEye Hotel & Resort",
    country: 4,
    city: ["Svilengrad", "Σβίλενγκραντ"] as Pair,
    summary: [
      "A hotel and resort destination in southern Bulgaria. Verify services before travel.",
      "Ξενοδοχειακός προορισμός στη νότια Βουλγαρία. Ελέγξτε τις υπηρεσίες πριν ταξιδέψετε.",
    ] as Pair,
    tags: [
      ["Hotel", "Ξενοδοχείο"],
      ["Dining", "Εστίαση"],
    ] as Pair[],
    url: "https://www.goldeneyehotels.com/en/",
  },
  {
    id: "hardrock",
    name: "Hard Rock Hotel & Casino Athens",
    country: 3,
    city: ["Athens · planned development", "Αθήνα · υπό ανάπτυξη"] as Pair,
    summary: [
      "Planned development, not listed as open. No current travel or availability is implied.",
      "Έργο υπό ανάπτυξη, δεν παρουσιάζεται ως ανοικτό. Δεν υπονοείται τρέχουσα διαθεσιμότητα.",
    ] as Pair,
    tags: [["Planned / not open", "Υπό ανάπτυξη / μη ανοικτό"]] as Pair[],
    url: "https://www.hardrock.com/athens",
    planned: true,
  },
];
export type RequestRecord = {
  ref: string;
  customerId: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  residence: string;
  customerType: string;
  destination: string;
  start: string;
  end: string;
  party: string;
  type: string;
  message: string;
  preference: string;
  status: string;
  demo: boolean;
};
export const demoRequests: RequestRecord[] = [
  {
    ref: "CB-DEMO-001",
    customerId: "CUS-DEMO-001",
    name: "Alex",
    surname: "Morgan",
    email: "alex@example.com",
    phone: "+44 000 000 0000",
    residence: "United Kingdom",
    customerType: "individual",
    destination: "City of Dreams Mediterranean",
    start: "2026-11-12",
    end: "2026-11-16",
    party: "2",
    type: "introduction",
    message: "Demo itinerary request",
    preference: "email",
    status: "new",
    demo: true,
  },
  {
    ref: "CB-DEMO-002",
    customerId: "CUS-DEMO-002",
    name: "Eleni",
    surname: "Demo",
    email: "eleni@example.com",
    phone: "+30 000 000 0000",
    residence: "Greece",
    customerType: "business",
    destination: "Perla Resort & Entertainment",
    start: "2026-12-03",
    end: "2026-12-06",
    party: "8",
    type: "group",
    message: "Demo business group",
    preference: "email",
    status: "reviewing",
    demo: true,
  },
  {
    ref: "CB-DEMO-003",
    customerId: "CUS-DEMO-003",
    name: "Daniel",
    surname: "Sample",
    email: "daniel@example.com",
    phone: "+49 000 000 0000",
    residence: "Germany",
    customerType: "individual",
    destination: "Porto Carras Grand Resort",
    start: "2027-05-10",
    end: "2027-05-15",
    party: "4",
    type: "transfer",
    message: "Demo airport transfer",
    preference: "whatsapp",
    status: "coordinating",
    demo: true,
  },
];
export const statusPairs: Record<string, Pair> = {
  new: ["New", "Νέο"],
  reviewing: ["In review", "Σε εξέταση"],
  coordinating: ["Coordinating", "Σε συντονισμό"],
  closed: ["Closed", "Κλειστό"],
};
export const requestTypes: Record<string, Pair> = {
  introduction: ["Casino introduction", "Γνωριμία με καζίνο"],
  flight: ["Flight assistance", "Βοήθεια πτήσεων"],
  transfer: ["Airport transfer", "Μεταφορά αεροδρομίου"],
  group: ["Group / corporate travel", "Ομαδικό / εταιρικό ταξίδι"],
};