import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { listTeachers }
  from "@/modules/teacher/services";

import { getSections }
  from "@/modules/sections/services/get-sections.service";

import { CreateClassTeacherAssignmentForm }
  from "@/components/class-teacher-assignment/create-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function CreateClassTeacherAssignmentPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const tenantId =
    currentUser.tenantId;

  const [
    teachers,
    sections,
  ] = await Promise.all([
    listTeachers(tenantId),

    getSections({
      tenantId,
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Assign Class Teacher"
        subtitle="Assign a teacher to a section."
      />

      <CreateClassTeacherAssignmentForm
        teachers={teachers}
        sections={sections}
      />
    </>
  );
}