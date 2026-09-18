import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { CreateUserForm } from "@/components/users/create-user-form";

import { PageHeader } from "@/components/ui/page-header";

export default async function CreateUserPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  return (
    <>
      <PageHeader
        title="Create User"
        subtitle="Create a new user for your school"
      />

      <CreateUserForm />
    </>
  );
}