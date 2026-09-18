import { z } from "zod";

export const createSubjectSchema =
  z.object({
    name: z
      .string()
      .min(2)
      .max(100),

    code: z
      .string()
      .min(2)
      .max(20),

    description: z
      .string()
      .max(500)
      .optional(),
  });

export type CreateSubjectInput =
  z.infer<
    typeof createSubjectSchema
  >;