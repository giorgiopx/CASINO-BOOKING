import { describe, expect, it } from "vitest";
import {
  approvedCountries,
  approvedCasinoDirectory,
  approvedOperatingCandidates,
  approvedTotals,
  countryVenues,
} from "../lib/approved-casino-directory";
import { enquirySchema } from "../lib/casino-request-schema";

const baseEnquiry = {
  name: "Sample",
  surname: "Guest",
  email: "sample@example.test",
  phone: "+302100000000",
  residence: "Greece",
  customerType: "individual" as const,
  start: "2026-12-10",
  end: "2026-12-15",
  party: "2",
  type: "introduction" as const,
  message: "",
  preference: "email" as const,
  consent: "on" as const,
};

describe("Approved directory release requirements", () => {
  it("keeps 15 countries, 51 listed candidates and one future project", () => {
    expect(approvedTotals).toEqual({
      countries: 15,
      activeCandidates: 51,
      planned: 1,
    });
    expect(approvedCountries).toHaveLength(15);
    expect(approvedCasinoDirectory).toHaveLength(52);
    expect(new Set(approvedCountries.map((c) => c.slug)).size).toBe(15);
    expect(new Set(approvedCasinoDirectory.map((c) => c.id)).size).toBe(52);
  });
  it("connects every record to one country and official https source", () => {
    for (const venue of approvedCasinoDirectory) {
      expect(
        approvedCountries.some((country) => country.slug === venue.countrySlug),
      ).toBe(true);
      expect(venue.officialUrl).toMatch(/^https:\/\//);
    }
    for (const country of approvedCountries) {
      expect(countryVenues(country.slug).length).toBeGreaterThan(0);
    }
  });
  it("does not accept the planned venue or Russia travel enquiries", () => {
    const wynn = approvedCasinoDirectory.find((v) => v.id === "wynn-al-marjan");
    expect(wynn?.status).toBe("planned");
    expect(approvedOperatingCandidates.some((v) => v.id === wynn?.id)).toBe(
      false,
    );
    const fromEurope = approvedOperatingCandidates.find(
      (v) => v.countrySlug === "monaco",
    );
    const fromRussia = approvedOperatingCandidates.find(
      (v) => v.countrySlug === "russia",
    );
    expect(
      enquirySchema.safeParse({ ...baseEnquiry, destination: fromEurope?.name })
        .success,
    ).toBe(true);
    expect(
      enquirySchema.safeParse({ ...baseEnquiry, destination: fromRussia?.name })
        .success,
    ).toBe(false);
    expect(
      enquirySchema.safeParse({ ...baseEnquiry, destination: wynn?.name })
        .success,
    ).toBe(false);
  });
});
