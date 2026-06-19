import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getTenants }
  from "@/modules/tenants/services/get-tenants.service";

import { TenantCard }
  from "@/components/tenants/tenant-card";

import { PageHeader }
  from "@/components/ui/page-header";

import { SectionContainer }
  from "@/components/ui/section-container";

  import Link from "next/link";

import {
  Button,
  Stack,
} from "@mui/material";

export default async function TenantsPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const tenants =
    await getTenants();

  return (
    <>
      <PageHeader
        title="Tenants"
        subtitle="Manage school tenants"
      />

      <Link href="/dashboard/tenants/create">
  <Button
    variant="contained"
    sx={{ mb: 3 }}
  >
    Create Tenant
  </Button>
</Link>

      <SectionContainer>
        {tenants.map(
          (tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
            />
          )
        )}
      </SectionContainer>
    </>
  );
}