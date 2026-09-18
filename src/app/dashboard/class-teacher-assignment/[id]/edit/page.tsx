import { notFound } from "next/navigation";

import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getClassTeacherAssignment }
  from "@/modules/class-teacher-assignment/services";

import { listTeachers }
  from "@/modules/teacher/services";

import { getSections }
  from "@/modules/sections/services/get-sections.service";

import { EditClassTeacherAssignmentForm }
  from "@/components/class-teacher-assignment/edit-form";

import { PageHeader }
  from "@/components/ui/page-header";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditClassTeacherAssignmentPage({
  params,
}: Props) {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const { id } =
    await params;

  const tenantId =
    currentUser.tenantId;

  const assignment =
    await getClassTeacherAssignment(
      id,
      tenantId,
    );

  if (!assignment) {
    notFound();
  }

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
        title="Edit Class Teacher"
        subtitle="Update the class teacher assignment."
      />

      <EditClassTeacherAssignmentForm
        id={assignment.id}
        initialTeacherId={
          assignment.teacherId
        }
        initialSectionId={
          assignment.sectionId
        }
        teachers={teachers}
        sections={sections}
      />
    </>
  );
}