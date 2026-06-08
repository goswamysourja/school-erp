import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getUserTenants } from "@/modules/users/services/get-user-tenants.service";

import { CreateUserForm } from "@/components/users/create-user-form";

export default async function CreateUserPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const tenants =
    await getUserTenants();

  return (
    <main>
      <h1>
        Create User
      </h1>

      <CreateUserForm
        tenants={tenants}
      />
    </main>
  );
}