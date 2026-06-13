import { z } from "zod";

export const updateClassSchema =
  z.object({
    name: z
      .string()
      .min(1)
      .max(100),

    section: z
      .string()
      .min(1)
      .max(20),

    academicYear: z
      .string()
      .min(1)
      .max(20),

    tenantId: z.string(),

    classTeacherId:
      z.string().optional(),
  });

export type UpdateClassInput =
  z.infer<
    typeof updateClassSchema
  >;