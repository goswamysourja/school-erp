import { z } from "zod";

export const updateTenantSchema =
  z.object({
    name: z
      .string()
      .min(3)
      .max(100),

    slug: z
      .string()
      .min(3)
      .max(100),

    isActive: z.boolean(),
  });

export type UpdateTenantInput =
  z.infer<
    typeof updateTenantSchema
  >;