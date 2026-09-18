import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { CreateClassForm } from "@/components/classes/create-class-form";

import { PageHeader } from "@/components/ui/page-header";

export default async function CreateClassPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing"
    );
  }

  return (
    <>
      <PageHeader
        title="Create Class"
        subtitle="Create a new academic class"
      />

      <CreateClassForm />
    </>
  );
}