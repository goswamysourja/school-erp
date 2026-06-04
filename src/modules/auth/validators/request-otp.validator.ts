import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.email(),
});

export type RequestOtpInput =
  z.infer<typeof requestOtpSchema>;