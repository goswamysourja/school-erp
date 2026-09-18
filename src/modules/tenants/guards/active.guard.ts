import { requireTenantExists } from "./exists.guard";

export async function requireActiveTenant(tenantId: string) {
  const tenant = await requireTenantExists(tenantId);

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  return tenant;
}