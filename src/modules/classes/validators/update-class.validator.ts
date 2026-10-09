import { z } from "zod";

export const updateClassSchema =
  z.object({
    name: z
      .string()
      .min(1)
      .max(100),

    academicYear: z
      .string()
      .min(1)
      .max(20),

    academicYearId: z
      .string()
      .min(1),
  });

export type UpdateClassInput =
  z.infer<
    typeof updateClassSchema
  >;