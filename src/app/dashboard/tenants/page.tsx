import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { getTenants } from "@/modules/tenants/services/get-tenants.service";
import { TenantCard } from "@/components/tenants/tenant-card";

export default async function TenantsPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const tenants =
    await getTenants();

  return (
    <main>
      <h1>Tenants</h1>

      {tenants.map(
        (tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
          />
        )
      )}
    </main>
  );
}