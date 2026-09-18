import { z } from "zod";

export const updateSubjectSchema =
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

    // tenantId:
    //   z.string(),
  });

export type UpdateSubjectInput =
  z.infer<
    typeof updateSubjectSchema
  >;