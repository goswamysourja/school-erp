import { z } from "zod";

export const updateUserSchema =
  z.object({
    name: z
      .string()
      .min(3)
      .max(100),

    role: z.enum([
      "ADMIN",
      "TEACHER",
      "STUDENT",
    ]),

    tenantId: z.string(),
  });

export type UpdateUserInput =
  z.infer<
    typeof updateUserSchema
  >;