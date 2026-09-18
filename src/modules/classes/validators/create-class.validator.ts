import { z } from "zod";

export const createClassSchema =
  z.object({
    name: z
      .string()
      .min(1)
      .max(50),

    academicYear: z
      .string()
      .min(4)
      .max(20),
  });

export type CreateClassInput =
  z.infer<
    typeof createClassSchema
  >;