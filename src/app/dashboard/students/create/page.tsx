import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getStudentSections }
  from "@/modules/students/services/get-student-sections.service";

import { CreateStudentForm }
  from "@/components/students/create-student-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function CreateStudentPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const sections =
    await getStudentSections({
      tenantId:
        currentUser.tenantId,
    });

  return (
    <>
      <PageHeader
        title="Create Student"
        subtitle="Add a new student"
      />

      <CreateStudentForm
        sections={sections}
      />
    </>
  );
}