import { Role } from "@prisma/client";

export const PLATFORM_ROLES = [
  Role.SUPER_ADMIN,
] as const;

export const TENANT_ROLES = [
  Role.ADMIN,
  Role.STAFF,
  Role.TEACHER, // Temporary: legacy accounts
] as const;