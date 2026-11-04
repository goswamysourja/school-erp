import { StaffDesignation } from "@prisma/client";
import { z } from "zod";

import { e164PhoneSchema } from "@/lib/validators/phone.validator";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must not exceed 100 characters."),

  phone: e164PhoneSchema,

  designation: z.nativeEnum(StaffDesignation, {
    message: "Please select a valid staff designation.",
  }),
});

export type CreateUserInput = z.infer<
  typeof createUserSchema
>;