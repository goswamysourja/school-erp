import { z } from "zod";

export const createSectionSchema =
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

    classId: z
      .string()
      .trim()
      .min(
        1,
        "Class ID is required."
      ),
  });

export type CreateSectionInput =
  z.infer<
    typeof createSectionSchema
  >;