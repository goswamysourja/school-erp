import { z } from "zod";

export const updateUserSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters.")
      .max(100, "Name must not exceed 100 characters."),
  });

export type UpdateUserInput =
  z.infer<
    typeof updateUserSchema
  >;