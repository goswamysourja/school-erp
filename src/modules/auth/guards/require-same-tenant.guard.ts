export function requireSameTenant(
  userTenantId: string | null,
  entityTenantId: string | null
) {
  if (
    !userTenantId ||
    !entityTenantId
  ) {
    throw new Error(
      "Tenant validation failed"
    );
  }

  if (
    userTenantId !==
    entityTenantId
  ) {
    throw new Error(
      "Cross-tenant access denied"
    );
  }
}