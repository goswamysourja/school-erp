import { z } from "zod";

export const createUserSchema =
  z.object({
    name: z
      .string()
      .min(3)
      .max(100),

    email: z
      .string()
      .email(),

    role: z.enum([
      "ADMIN",
      "TEACHER",
      "STUDENT",
    ]),

    tenantId: z.string(),
  });

export type CreateUserInput =
  z.infer<
    typeof createUserSchema
  >;