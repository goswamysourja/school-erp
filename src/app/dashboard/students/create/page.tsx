import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getStudentTenants }
  from "@/modules/students/services/get-student-tenants.service";

import { getStudentClasses }
  from "@/modules/students/services/get-student-classes.service";

import { CreateStudentForm }
  from "@/components/students/create-student-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function CreateStudentPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const tenants =
    await getStudentTenants();

  const classes =
    await getStudentClasses();

  return (
    <>
      <PageHeader
        title="Create Student"
        subtitle="Add a new student"
      />

      <CreateStudentForm
        tenants={tenants}
        classes={classes}
      />
    </>
  );
}