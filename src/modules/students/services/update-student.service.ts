import { prisma } from "@/lib/prisma/client";

interface UpdateStudentInput {
  id: string;

  admissionNumber: string;

  firstName: string;
  lastName: string;

  gender: string;

  dateOfBirth?: string;

  guardianName?: string;

  phone?: string;

  address?: string;

  tenantId: string;

  sectionId: string;
}

export async function updateStudent(
  input: UpdateStudentInput
) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: input.tenantId,
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found"
    );
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error(
      "Tenant is inactive"
    );
  }

  const student =
    await prisma.student.findUnique({
      where: {
        id: input.id,
      },
    });

  if (!student) {
    throw new Error(
      "Student not found"
    );
  }

  if (
    student.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Student belongs to another tenant"
    );
  }

  const section =
    await prisma.section.findUnique({
      where: {
        id: input.sectionId,
      },
    });

  if (!section) {
    throw new Error(
      "Section not found"
    );
  }

  if (!section.isActive) {
    throw new Error(
      "Section is inactive"
    );
  }

  if (
    section.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Section belongs to another tenant"
    );
  }

  const classItem =
    await prisma.class.findUnique({
      where: {
        id: section.classId,
      },
    });

  if (!classItem) {
    throw new Error(
      "Class not found"
    );
  }

  if (!classItem.isActive) {
    throw new Error(
      "Class is inactive"
    );
  }

  if (
    classItem.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Class belongs to another tenant"
    );
  }

  if (!classItem.academicYearId) {
    throw new Error(
      "Class is not linked to an academic year"
    );
  }

  const existingStudent =
    await prisma.student.findFirst({
      where: {
        tenantId:
          input.tenantId,

        admissionNumber:
          input.admissionNumber,

        NOT: {
          id: input.id,
        },
      },
    });

  if (existingStudent) {
    throw new Error(
      "Admission number already exists"
    );
  }

  return prisma.student.update({
    where: {
      id: student.id,
    },

    data: {
      admissionNumber:
        input.admissionNumber,

      firstName:
        input.firstName,

      lastName:
        input.lastName,

      gender:
        input.gender,

      dateOfBirth:
        input.dateOfBirth
          ? new Date(
              input.dateOfBirth
            )
          : null,

      guardianName:
        input.guardianName,

      phone:
        input.phone,

      address:
        input.address,

      sectionId:
        input.sectionId,
    },
  });
}