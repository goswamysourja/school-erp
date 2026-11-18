import { prisma } from "@/lib/prisma/client";

import { generateTenantId } from "@/modules/common/services/generate-id.service";

interface CreateStudentInput {
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
  input: CreateStudentInput,
) {
  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.findUnique({
      where: {
        id: input.tenantId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!tenant) {
      throw new Error("Tenant not found.");
    }

    if (tenant.status !== "ACTIVE") {
      throw new Error("Tenant is inactive.");
    }

    const section = await tx.section.findUnique({
      where: {
        id: input.sectionId,
      },
    });

    if (!section) {
      throw new Error("Section not found.");
    }

    if (!section.isActive) {
      throw new Error("Section is inactive.");
    }

    if (section.tenantId !== input.tenantId) {
      throw new Error("Section belongs to another tenant.");
    }

    const classItem = await tx.class.findUnique({
      where: {
        id: section.classId,
      },
      include: {
        academicYearRecord: {
          select: {
            startDate: true,
            tenantId: true,
          },
        },
      },
    });

    if (!classItem) {
      throw new Error("Class not found.");
    }

    if (!classItem.isActive) {
      throw new Error("Class is inactive.");
    }

    if (classItem.tenantId !== input.tenantId) {
      throw new Error("Class belongs to another tenant.");
    }

    if (
      !classItem.academicYearId ||
      !classItem.academicYearRecord
    ) {
      throw new Error(
        "Class is not linked to a valid academic year.",
      );
    }

    if (
      classItem.academicYearRecord.tenantId !==
      input.tenantId
    ) {
      throw new Error(
        "Academic year belongs to another tenant.",
      );
    }

    // Use the academic year's start year.
    const admissionYear =
      classItem.academicYearRecord.startDate
        .getUTCFullYear()
        .toString();

    const admissionNumber = await generateTenantId(tx, {
      tenantId: input.tenantId,
      sequenceKey: `STUDENT-${admissionYear}`,
      prefix: `STU-${admissionYear}`,
      padding: 6,
    });

    return tx.student.create({
      data: {
        admissionNumber,
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        dateOfBirth: input.dateOfBirth
          ? new Date(input.dateOfBirth)
          : null,
        guardianName: input.guardianName,
        phone: input.phone,
        address: input.address,
        tenantId: input.tenantId,
        sectionId: input.sectionId,
      },
    });
  });
}