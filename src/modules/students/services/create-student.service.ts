import { prisma } from "@/lib/prisma/client";

interface CreateStudentInput {
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

export async function createStudent(
  input: CreateStudentInput
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
      },
    });

  if (existingStudent) {
    throw new Error(
      "Admission number already exists"
    );
  }

  return prisma.student.create({
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

      tenantId:
        input.tenantId,

      sectionId:
        input.sectionId,
    },
  });
}