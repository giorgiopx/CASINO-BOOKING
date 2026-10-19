import { z } from "zod";
import {
  mobilePhoneSchema,
  selectedServicesSchema,
} from "./casino-request-schema";

export const customerProfileSchema = z
  .object({
    customerType: z.enum(["individual", "business"]),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(255),
    phone: mobilePhoneSchema,
    residence: z.string().trim().min(1).max(80),
    companyName: z.string().trim().max(160),
    services: selectedServicesSchema,
  })
  .refine(
    (value) =>
      value.customerType !== "business" || value.companyName.length > 0,
    {
      path: ["companyName"],
      message: "companyRequired",
    },
  );

export type CustomerProfileInput = z.infer<typeof customerProfileSchema>;
