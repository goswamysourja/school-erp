import { Role } from "@prisma/client";

export function requireTenantAssignment(
  role: Role,
  tenantId?: string | null
) {
  if (
    role === Role.SUPER_ADMIN
  ) {
    return;
  }

  if (!tenantId) {
    throw new Error(
      "Tenant assignment is required"
    );
  }
}