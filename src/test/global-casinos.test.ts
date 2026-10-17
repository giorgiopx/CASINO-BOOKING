import { describe, expect, it } from "vitest";
import {
  globalDestinations,
  globalVenues,
  operatingGlobalVenues,
  searchGlobalDestinations,
} from "../lib/global-casino-catalog";
import { countries } from "../lib/casino-data";
import { enquirySchema } from "../lib/casino-request-schema";

describe("Worldwide casino research and enquiry integration", () => {
  it("searches bilingual regions and localities without unrelated venue matches", () => {
    expect(
      searchGlobalDestinations("Νεβαδα", "US").flatMap(({ venues }) => venues),
    ).toHaveLength(3);
    expect(
      searchGlobalDestinations("Τεμεκουλα", "US")
        .flatMap(({ venues }) => venues)
        .map(({ id }) => id),
    ).toEqual(["pechanga"]);
    expect(
      searchGlobalDestinations("Bellagio", "US")
        .flatMap(({ venues }) => venues)
        .map(({ id }) => id),
    ).toEqual(["bellagio"]);
    expect(searchGlobalDestinations("ΗΑΕ", "US")).toEqual([]);
    expect(
      searchGlobalDestinations("ΗΑΕ", "AE")
        .flatMap(({ venues }) => venues)
        .map(({ id }) => id),
    ).toEqual(["wynn-al-marjan"]);
    expect(
      searchGlobalDestinations("", "US").flatMap(({ venues }) => venues),
    ).toHaveLength(18);
    expect(
      searchGlobalDestinations("", "all").flatMap(({ venues }) => venues),
    ).toHaveLength(19);
  });
  it("has translated locality and state labels on every international record", () => {
    for (const venue of globalVenues) {
      expect(venue.localityEl).toMatch(/[Α-ω]/);
      expect(venue.stateEl).toMatch(/[Α-ω]/);
    }
    for (const destination of globalDestinations)
      expect(destination.stateEl).toMatch(/[Α-ω]/);
  });
  it("does not advertise planned UAE casino as operating", () => {
    expect(globalVenues.filter((v) => v.country === "AE")).toHaveLength(1);
    expect(globalVenues.find((v) => v.id === "wynn-al-marjan")?.status).toBe(
      "planned",
    );
    expect(
      operatingGlobalVenues.every(
        (v) => v.country === "US" && v.status === "operating",
      ),
    ).toBe(true);
  });
  it("links every venue to a source and a valid region", () => {
    expect(new Set(globalVenues.map((v) => v.id)).size).toBe(
      globalVenues.length,
    );
    for (const v of globalVenues) expect(v.officialUrl).toMatch(/^https:\/\//);
    for (const d of globalDestinations) {
      expect(d.venueIds.length).toBeGreaterThan(0);
      for (const id of d.venueIds)
        expect(globalVenues.some((v) => v.id === id)).toBe(true);
      if (d.photoFile) {
        expect(d.photoPage).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
        expect(d.photoCreator).toBeTruthy();
        expect(d.photoLicense).toBeTruthy();
      }
    }
  });
  it("accepts US casino names and all original design's European destinations", () => {
    for (const place of [
      "Monaco",
      "Italy",
      "France",
      "Spain",
      "Portugal",
      "Serbia",
      "Romania",
      "Croatia",
    ]) {
      expect(countries.some(([name]) => name === place)).toBe(true);
    }
    const example = {
      name: "Sample",
      surname: "Guest",
      email: "sample@example.test",
      phone: "+30 699 000 0000",
      residence: "Greece",
      customerType: "individual",
      destination: "",
      start: "2026-12-10",
      end: "2026-12-15",
      party: "2",
      type: "introduction",
      message: "",
      preference: "email",
      consent: "on",
    };
    expect(
      enquirySchema.safeParse({
        ...example,
        destination: "Seminole Hard Rock Hotel & Casino Hollywood",
      }).success,
    ).toBe(true);
    expect(
      enquirySchema.safeParse({
        ...example,
        destination: "Wynn Al Marjan Island",
      }).success,
    ).toBe(false);
    expect(
      enquirySchema.safeParse({
        ...example,
        destination: "Hard Rock Hotel & Casino Athens",
      }).success,
    ).toBe(false);
    expect(
      enquirySchema.safeParse({
        ...example,
        destination: "City of Dreams Mediterranean",
      }).success,
    ).toBe(true);
    expect(
      enquirySchema.safeParse({
        ...example,
        destination: "Non-existent Casino Club",
      }).success,
    ).toBe(false);
  });
});
