import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Please share your name.").max(120),
  email: z.string().email("Please share a valid email address."),
  phone: z
    .string()
    .max(40)
    .optional()
    .or(z.literal("")),
  dates: z.string().max(120).optional().or(z.literal("")),
  groupSize: z.coerce.number().int().min(1).max(50).optional(),
  boatId: z.string().max(64).optional().or(z.literal("")),
  boatName: z.string().max(120).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  sourcePage: z.string().max(200).optional().or(z.literal("")),
  // Honeypot — must be empty when humans submit.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

export const fleetFilterSchema = z.object({
  type: z
    .enum(["motor_yacht", "sailing_yacht", "catamaran", "day_boat", "sport_yacht"])
    .optional(),
  minGuests: z.coerce.number().int().min(1).max(50).optional(),
  minLength: z.coerce.number().min(5).max(60).optional(),
  maxLength: z.coerce.number().min(5).max(60).optional(),
  maxPrice: z.coerce.number().int().min(0).max(100000).optional(),
  brand: z.string().max(80).optional(),
});

export type FleetFilters = z.infer<typeof fleetFilterSchema>;
