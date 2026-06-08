import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { getTenantById } from "@/modules/tenants/services/get-tenant-by-id.service";

import { EditTenantForm } from "@/components/tenants/edit-tenant-form";

export default async function EditTenantPage(
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const { id } =
    await params;

  const tenant =
    await getTenantById(
      id
    );

  if (!tenant) {
    return (
      <h1>
        Tenant not found
      </h1>
    );
  }

  return (
    <main>
      <h1>
        Edit Tenant
      </h1>

      <EditTenantForm
        id={tenant.id}
        initialName={
          tenant.name
        }
        initialSlug={
          tenant.slug
        }
        initialIsActive={
          tenant.isActive
        }
      />
    </main>
  );
}