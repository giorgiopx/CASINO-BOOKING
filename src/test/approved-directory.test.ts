import { describe, expect, it } from "vitest";
import {
  approvedCountries, approvedCasinoDirectory, approvedOperatingCandidates,
  approvedTotals, countryVenues
} from "../lib/approved-casino-directory";
import { enquirySchema } from "../lib/casino-request-schema";

const sample = {
  name: "Test", surname: "Guest", email: "test@example.test", phone: "+30 699 000 0000",
  residence: "Greece", customerType: "individual", destination: "",
  start: "2026-12-10", end: "2026-12-14", party: "2",
  type: "introduction", message: "Travel planning", preference: "email", consent: "on"
};

describe("User-approved 15 country catalogue, free enquiries", () => {
  it("contains 12 original European cards plus USA, Russia and planned UAE", () => {
    expect(approvedTotals).toEqual({ countries: 15, activeCandidates: 51, planned: 1 });
    expect(approvedCountries.map(c => c.slug)).toEqual([
      "monaco","cyprus","greece","italy","france","spain","portugal",
      "serbia","romania","slovenia","bulgaria","croatia","usa","russia","uae"
    ]);
    expect(approvedCountries.filter(c => c.kind === "europe")).toHaveLength(12);
    expect(countryVenues("usa")).toHaveLength(18);
    expect(countryVenues("russia")).toHaveLength(3);
    expect(countryVenues("uae")).toHaveLength(1);
    expect(countryVenues("uae")[0]?.status).toBe("planned");
  });

  it("provides traceable venue sources and country pages", () => {
    expect(new Set(approvedCasinoDirectory.map(v => v.id)).size).toBe(52);
    expect(new Set(approvedCasinoDirectory.map(v => v.name)).size).toBe(52);
    for (const country of approvedCountries) {
      expect(countryVenues(country.slug).length).toBeGreaterThan(0);
      expect(country.image).toBeTruthy();
    }
    for (const venue of approvedCasinoDirectory) {
      expect(venue.officialUrl).toMatch(/^https:\/\//);
      expect(venue.sourceChecked).toMatch(/^2026-/);
    }
  });

  it("allows all 51 non-planned venues and 14 countries in travel requests", () => {
    for(const venue of approvedOperatingCandidates) {
      const parsed = enquirySchema.safeParse({...sample,destination:venue.name});
      expect(parsed.success, venue.name).toBe(true);
    }
    for(const country of approvedCountries.filter(c => c.kind !== "planned")) {
      expect(enquirySchema.safeParse({...sample,destination:country.name[0]}).success).toBe(true);
    }
    expect(enquirySchema.safeParse({...sample,destination:"Wynn Al Marjan Island"}).success).toBe(false);
    expect(enquirySchema.safeParse({...sample,destination:"United Arab Emirates"}).success).toBe(false);
    expect(enquirySchema.safeParse({...sample,destination:"Hard Rock Hotel & Casino Athens"}).success).toBe(false);
  });
});
