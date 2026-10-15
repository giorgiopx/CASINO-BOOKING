import { z } from "zod";
import { casinos, countries } from "./casino-data";
import { operatingGlobalVenues } from "./global-casino-catalog";
import { approvedOperatingCandidates } from "./approved-casino-directory";

const requiredText = z.string().trim().min(1).max(80);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  });
export const enquirySchema = z
  .object({
    name: requiredText,
    surname: requiredText,
    email: z.string().trim().email().max(255),
    phone: z
      .string()
      .trim()
      .max(24)
      .regex(/^\+[\d\s()-]{7,22}$/)
      .refine(
        (value) =>
          value.replace(/\D/g, "").length >= 7 &&
          value.replace(/\D/g, "").length <= 15,
      ),
    residence: requiredText,
    customerType: z.enum(["individual", "business"]),
    destination: z
      .string()
      .refine(
        (value) =>
          value === "undecided" ||
          casinos.some((casino) => !casino.planned && casino.name === value) ||
          countries.slice(1).some((country) => country[0] === value) ||
          operatingGlobalVenues.some((venue) => venue.name === value) ||
          approvedOperatingCandidates.some(
            (venue) => venue.countrySlug !== "russia" && venue.name === value,
          ),
      ),
    start: date,
    end: date,
    party: z
      .string()
      .regex(/^\d+$/)
      .refine((value) => Number(value) >= 1 && Number(value) <= 200),
    type: z.enum(["introduction", "flight", "transfer", "group"]),
    message: z.string().trim().max(2000),
    preference: z.enum(["email", "whatsapp"]),
    consent: z.literal("on"),
  })
  .refine((value) => value.end >= value.start, {
    path: ["end"],
    message: "dateOrder",
  });

export function csvCell(value: string) {
  const safe = /^[\s]*[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
