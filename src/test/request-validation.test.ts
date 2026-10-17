import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  enquirySchema,
  resolveRequestDefaults,
  selectedServicesSchema,
  travelDateSchema,
} from "../lib/casino-request-schema";

const enquiry = {
  name: "Sample",
  surname: "Traveller",
  email: "traveller@example.test",
  phone: "+30 699 000 0000",
  residence: "Greece",
  customerType: "individual",
  destination: "Monaco",
  start: "2026-12-10",
  end: "2026-12-15",
  party: "2",
  type: "introduction",
  message: "A free travel enquiry",
  preference: "email",
  consent: "on",
};

describe("Free travel enquiry validation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 17, 12));
  });
  afterEach(() => vi.useRealTimers());

  it("accepts a complete enquiry without payment data", () => {
    expect(enquirySchema.safeParse(enquiry).success).toBe(true);
  });
  it.each(["2026-02-30", "2026-13-01", "invalid", "2026-1-1"])(
    "rejects impossible date %s",
    (value) => expect(travelDateSchema.safeParse(value).success).toBe(false),
  );
  it("rejects past departure and reversed dates", () => {
    expect(
      enquirySchema.safeParse({ ...enquiry, start: "2026-10-16" }).success,
    ).toBe(false);
    expect(
      enquirySchema.safeParse({ ...enquiry, end: "2026-12-09" }).success,
    ).toBe(false);
    expect(
      enquirySchema.safeParse({ ...enquiry, end: enquiry.start }).success,
    ).toBe(true);
  });
  it.each(["0", "201", "2.5", "-1"])(
    "rejects invalid party size %s",
    (party) => {
      expect(enquirySchema.safeParse({ ...enquiry, party }).success).toBe(
        false,
      );
    },
  );
  it("requires consent and a valid international phone number", () => {
    expect(
      enquirySchema.safeParse({ ...enquiry, consent: undefined }).success,
    ).toBe(false);
    expect(
      enquirySchema.safeParse({ ...enquiry, phone: "+++++++" }).success,
    ).toBe(false);
    expect(
      enquirySchema.safeParse({ ...enquiry, phone: "6990000000" }).success,
    ).toBe(false);
  });
  it.each(["Wynn Al Marjan Island", "Russia", "Unknown Casino"])(
    "does not accept an unavailable destination: %s",
    (destination) =>
      expect(enquirySchema.safeParse({ ...enquiry, destination }).success).toBe(
        false,
      ),
  );
  it("requires one or more of the existing free service keys", () => {
    expect(selectedServicesSchema.safeParse([]).success).toBe(false);
    expect(selectedServicesSchema.safeParse(["vip_subscription"]).success).toBe(
      false,
    );
    expect(
      selectedServicesSchema.safeParse([
        "casino",
        "hotel",
        "flight",
        "transfer",
        "cruise",
        "package",
      ]).success,
    ).toBe(true);
  });
  it.each([
    ["hotel", "hotel", "introduction"],
    ["flight", "flight", "flight"],
    ["transfer", "transfer", "transfer"],
    ["cruise", "cruise", "introduction"],
    ["bundle", "package", "introduction"],
    ["concierge", "casino", "introduction"],
  ])(
    "maps %s links to the compatible service and request type",
    (type, service, requestType) => {
      expect(resolveRequestDefaults({ type })).toMatchObject({
        service,
        requestType,
      });
    },
  );
  it("preserves numeric query values parsed by the router", () => {
    expect(resolveRequestDefaults({ party: 6, country: 1 })).toMatchObject({
      party: "6",
    });
    expect(resolveRequestDefaults({ party: -1 })).toMatchObject({ party: "2" });
  });
  it("preserves valid search details and discards invalid query defaults", () => {
    expect(
      resolveRequestDefaults({
        interest: "Monaco",
        start: "2026-12-10",
        end: "2026-12-15",
        party: "4",
      }),
    ).toMatchObject({
      destination: "Monaco",
      start: "2026-12-10",
      end: "2026-12-15",
      party: "4",
    });
    expect(
      resolveRequestDefaults({
        interest: "<script>",
        start: "2026-01-01",
        party: "999",
        type: "checkout",
      }),
    ).toMatchObject({
      destination: "",
      start: "",
      party: "2",
      service: "casino",
    });
    expect(
      resolveRequestDefaults({ start: "2026-12-10", end: "2026-12-09" }).end,
    ).toBe("");
  });
});
