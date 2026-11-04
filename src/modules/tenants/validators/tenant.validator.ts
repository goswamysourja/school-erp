
import { z } from "zod";

export const tenantStatusSchema = z.enum([
  "PENDING",
  "PENDING_ADMIN",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "REJECTED",
]);

export const createTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tenant name must be at least 2 characters.")
    .max(100, "Tenant name must not exceed 100 characters."),

  adminName: z
    .string()
    .trim()
    .min(2, "Admin name must be at least 2 characters.")
    .max(100, "Admin name must not exceed 100 characters."),

  adminPhone: z
    .string()
    .trim()
    .min(10, "Admin phone number must be at least 10 characters.")
    .max(15, "Admin phone number must not exceed 15 characters."),
});

export const updateTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tenant name must be at least 2 characters.")
    .max(100, "Tenant name must not exceed 100 characters."),

  slug: z
    .string()
    .trim()
    .min(2, "Tenant slug must be at least 2 characters.")
    .max(100, "Tenant slug must not exceed 100 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens.",
    ),
});

export const updateTenantStatusSchema = z.object({
  status: tenantStatusSchema,
});

export const assignTenantAdminSchema = z.object({
  userId: z
    .string()
    .trim()
    .min(1, "User ID is required."),
});

export type CreateTenantInput = z.infer<
  typeof createTenantSchema
>;

export type UpdateTenantInput = z.infer<
  typeof updateTenantSchema
>;

export type UpdateTenantStatusInput = z.infer<
  typeof updateTenantStatusSchema
>;

export type AssignTenantAdminInput = z.infer<
  typeof assignTenantAdminSchema
>;
