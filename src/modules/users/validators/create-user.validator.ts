import { z } from "zod";

export const createUserSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters.")
      .max(100, "Name must not exceed 100 characters."),

    phone: z
      .string()
      .trim()
      .min(10, "Phone number must be at least 10 characters.")
      .max(15, "Phone number must not exceed 15 characters."),
  });

export type CreateUserInput =
  z.infer<
    typeof createUserSchema
  >;