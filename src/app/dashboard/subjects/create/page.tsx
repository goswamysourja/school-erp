import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { PageHeader }
  from "@/components/ui/page-header";

import { CreateSubjectForm }
  from "@/components/subjects/create-subject-form";

export default async function CreateSubjectPage() {
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
        title="Create Subject"
        subtitle="Create a new subject for your school."
      />

      <CreateSubjectForm />
    </>
  );
}