import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getUserById }
  from "@/modules/users/services/get-user-by-id.service";

import { getUserTenants }
  from "@/modules/users/services/get-user-tenants.service";

import { EditUserForm }
  from "@/components/users/edit-user-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function EditUserPage(
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

  const user =
    await getUserById(id);

  const tenants =
    await getUserTenants();

  if (!user) {
    return (
      <h1>
        User not found
      </h1>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit User"
        subtitle="Update user details"
      />

      <EditUserForm
        id={user.id}
        initialName={
          user.name
        }
        initialRole={
          user.role
        }
        initialTenantId={
          user.tenantId ?? ""
        }
        tenants={tenants}
      />
    </>
  );
}