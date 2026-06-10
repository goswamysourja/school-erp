import { z } from "zod";

export const createClassSchema =
  z.object({
    name: z
      .string()
      .min(1)
      .max(50),

    section: z
      .string()
      .min(1)
      .max(10),

    academicYear: z
      .string()
      .min(4)
      .max(20),

    tenantId: z.string(),

    classTeacherId:
      z.string().optional(),
  });

export type CreateClassInput =
  z.infer<
    typeof createClassSchema
  >;