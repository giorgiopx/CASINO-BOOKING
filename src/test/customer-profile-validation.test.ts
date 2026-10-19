import { describe, expect, it } from "vitest";
import { customerProfileSchema } from "../lib/customer-profile-schema";
import { selectedServicesSchema } from "../lib/casino-request-schema";

const individual = {
  customerType: "individual",
  firstName: "Synthetic",
  lastName: "Traveller",
  email: "traveller@example.test",
  phone: "+30 699 000 0000",
  residence: "Greece",
  companyName: "",
  services: ["casino", "hotel"],
};

describe("Customer profile validation", () => {
  it("requires complete contact details and at least one service", () => {
    expect(customerProfileSchema.safeParse(individual).success).toBe(true);
    for (const field of [
      "firstName",
      "lastName",
      "email",
      "phone",
      "residence",
    ]) {
      expect(
        customerProfileSchema.safeParse({ ...individual, [field]: "" }).success,
      ).toBe(false);
    }
    expect(
      customerProfileSchema.safeParse({ ...individual, services: [] }).success,
    ).toBe(false);
  });
  it("requires a nonblank company for business accounts", () => {
    expect(
      customerProfileSchema.safeParse({
        ...individual,
        customerType: "business",
        companyName: "  ",
      }).success,
    ).toBe(false);
    expect(
      customerProfileSchema.safeParse({
        ...individual,
        customerType: "business",
        companyName: "Example Ltd",
      }).success,
    ).toBe(true);
  });
  it("rejects unsupported, duplicate and null services", () => {
    for (const services of [["casino", "casino"], ["subscription"], [null]]) {
      expect(selectedServicesSchema.safeParse(services).success).toBe(false);
    }
  });
});
