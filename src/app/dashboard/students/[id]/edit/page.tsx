import { notFound } from "next/navigation";

import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getStudentById } from "@/modules/students/services/get-student-by-id.service";

import { getStudentSections } from "@/modules/students/services/get-student-sections.service";

import { EditStudentForm } from "@/components/students/edit-student-form";

import { PageHeader } from "@/components/ui/page-header";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentPage({
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

  const student =
    await getStudentById(
      id,
      tenantId,
    );

  if (!student) {
    notFound();
  }

  const sections =
    await getStudentSections({
      tenantId,
    });

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
          student.guardianName ?? ""
        }
        initialPhone={
          student.phone ?? ""
        }
        initialAddress={
          student.address ?? ""
        }
        initialSectionId={
          student.sectionId ?? ""
        }
        sections={sections}
      />
    </>
  );
}