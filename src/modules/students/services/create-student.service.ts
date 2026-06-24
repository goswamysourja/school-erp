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

  classId: string;
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

  if (!tenant.isActive) {
    throw new Error(
      "Tenant is inactive"
    );
  }

  const classItem =
    await prisma.class.findUnique({
      where: {
        id: input.classId,
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

      classId:
        input.classId,
    },
  });
}