import { z } from "zod";

import { e164PhoneSchema } from "@/lib/validators/phone.validator";

export const verifyOtpSchema = z.object({
  phone: e164PhoneSchema,
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits."),
});

export type VerifyOtpInput = z.infer<
  typeof verifyOtpSchema
>;