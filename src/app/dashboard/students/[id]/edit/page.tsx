import { Role }
  from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getStudentById }
  from "@/modules/students/services/get-student-by-id.service";

import { getStudentTenants }
  from "@/modules/students/services/get-student-tenants.service";

import { getStudentClasses }
  from "@/modules/students/services/get-student-classes.service";

import { EditStudentForm }
  from "@/components/students/edit-student-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function EditStudentPage(
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

  const student =
    await getStudentById(
      id
    );

  const tenants =
    await getStudentTenants();

  const classes =
    await getStudentClasses();

  if (!student) {
    return (
      <h1>
        Student not found
      </h1>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Student"
        subtitle="Update student information"
      />

      <EditStudentForm
        id={student.id}
        initialAdmissionNumber={
          student.admissionNumber
        }
        initialFirstName={
          student.firstName
        }
        initialLastName={
          student.lastName
        }
        initialGender={
          student.gender
        }
        initialDateOfBirth={
          student.dateOfBirth
            ? student.dateOfBirth
                .toISOString()
                .split("T")[0]
            : ""
        }
        initialGuardianName={
          student.guardianName ??
          ""
        }
        initialPhone={
          student.phone ?? ""
        }
        initialAddress={
          student.address ?? ""
        }
        initialTenantId={
          student.tenantId
        }
        initialClassId={
          student.classId
        }
        tenants={tenants}
        classes={classes}
      />
    </>
  );
}