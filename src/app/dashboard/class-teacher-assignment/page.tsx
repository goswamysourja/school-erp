import { Role } from "@prisma/client";

import { requireRole } from
  "@/modules/auth/guards/require-role.guard";

import ClassTeacherAssignmentManage from
  "@/modules/class-teacher-assignment/components/manage";

import { PageHeader } from
  "@/components/ui/page-header";

export default async function ClassTeacherAssignmentPage() {
  await requireRole([
    Role.ADMIN,
  ]);

  return (
    <>
      <PageHeader
        title="Class Teachers"
        subtitle="Manage class teacher assignments for your school."
      />

      <ClassTeacherAssignmentManage />
    </>
  );
}