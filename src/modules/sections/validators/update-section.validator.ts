import { z } from "zod";

export const updateSectionSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Section name is required."
      )
      .max(
        100,
        "Section name must not exceed 100 characters."
      ),
  });

export type UpdateSectionInput =
  z.infer<
    typeof updateSectionSchema
  >;