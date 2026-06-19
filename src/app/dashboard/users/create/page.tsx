import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getUserTenants }
  from "@/modules/users/services/get-user-tenants.service";

import { CreateUserForm }
  from "@/components/users/create-user-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function CreateUserPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const tenants =
    await getUserTenants();

  return (
    <>
      <PageHeader
        title="Create User"
        subtitle="Create a new tenant user"
      />

      <CreateUserForm
        tenants={tenants}
      />
    </>
  );
}