import { Role }
  from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { PageHeader }
  from "@/components/ui/page-header";

import { CreateTenantForm }
  from "@/components/tenants/create-tenant-form";

export default async function CreateTenantPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  return (
    <>
      <PageHeader
        title="Create Tenant"
        subtitle="Register a new school tenant"
      />

      <CreateTenantForm />
    </>
  );
}