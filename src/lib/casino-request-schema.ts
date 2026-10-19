import { z } from "zod";
import { countries } from "./casino-data";
import { isApprovedRequestDestination } from "./approved-casino-directory";

const requiredText = z.string().trim().min(1).max(80);
export const mobilePhoneSchema = z
  .string()
  .trim()
  .max(24)
  .regex(/^\+[\d\s()-]{7,22}$/)
  .refine((value) => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  });
export function localToday(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export const travelDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  });
const departureDate = travelDateSchema.refine(
  (value) => value >= localToday(),
  {
    message: "pastDate",
  },
);
const destinationSchema = z
  .string()
  .refine(
    (value) => value === "undecided" || isApprovedRequestDestination(value),
  );
const partySchema = z
  .string()
  .regex(/^\d+$/)
  .refine((value) => Number(value) >= 1 && Number(value) <= 200);
export const requestTypeSchema = z.enum([
  "introduction",
  "flight",
  "transfer",
  "group",
]);
export const serviceSchema = z.enum([
  "casino",
  "flight",
  "hotel",
  "transfer",
  "cruise",
  "package",
]);
export const selectedServicesSchema = z
  .array(serviceSchema)
  .min(1)
  .max(6)
  .refine(
    (values) => new Set(values).size === values.length,
    "duplicateServices",
  );

export const requestSearchSchema = z.object({
  interest: destinationSchema.optional().catch(undefined),
  country: z.preprocess(
    (value) => (typeof value === "number" ? String(value) : value),
    z.enum(["0", "1", "2", "3", "4"]).optional().catch(undefined),
  ),
  start: departureDate.optional().catch(undefined),
  end: departureDate.optional().catch(undefined),
  party: z.preprocess(
    (value) => (typeof value === "number" ? String(value) : value),
    partySchema.optional().catch(undefined),
  ),
  type: z
    .enum([
      "introduction",
      "group",
      "casino",
      "concierge",
      "flight",
      "hotel",
      "transfer",
      "cruise",
      "package",
      "packages",
      "bundle",
    ])
    .optional()
    .catch(undefined),
});
export type RequestSearch = z.infer<typeof requestSearchSchema>;

export function resolveRequestDefaults(input: unknown) {
  const search = requestSearchSchema.parse(input);
  const legacyCountry = countries[Number(search.country)]?.[0];
  const service = serviceSchema.safeParse(search.type);
  const requestType = requestTypeSchema.safeParse(search.type);
  return {
    destination:
      search.interest ??
      (legacyCountry && isApprovedRequestDestination(legacyCountry)
        ? legacyCountry
        : ""),
    start: search.start ?? "",
    end:
      search.end && (!search.start || search.end >= search.start)
        ? search.end
        : "",
    party: search.party ?? "2",
    requestType: requestType.success ? requestType.data : "introduction",
    service: service.success
      ? service.data
      : ["bundle", "packages"].includes(search.type ?? "")
        ? "package"
        : "casino",
  };
}
export const enquirySchema = z
  .object({
    name: requiredText,
    surname: requiredText,
    email: z.string().trim().email().max(255),
    phone: mobilePhoneSchema,
    residence: requiredText,
    customerType: z.enum(["individual", "business"]),
    companyName: z.string().trim().max(160).default(""),
    services: selectedServicesSchema,
    destination: destinationSchema,
    start: departureDate,
    end: travelDateSchema,
    party: partySchema,
    type: requestTypeSchema,
    message: z.string().trim().max(2000),
    preference: z.enum(["email", "whatsapp"]),
    consent: z.literal("on"),
  })
  .refine(
    (value) =>
      value.customerType !== "business" || value.companyName.length > 0,
    {
      path: ["companyName"],
      message: "companyRequired",
    },
  )
  .refine((value) => value.end >= value.start, {
    path: ["end"],
    message: "dateOrder",
  });

export function csvCell(value: string) {
  const safe = /^[\s]*[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
