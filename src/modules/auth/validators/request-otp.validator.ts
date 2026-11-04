import { z } from "zod";

import { e164PhoneSchema } from "@/lib/validators/phone.validator";

export const requestOtpSchema = z.object({
  phone: e164PhoneSchema,
});

export type RequestOtpInput = z.infer<
  typeof requestOtpSchema
>;