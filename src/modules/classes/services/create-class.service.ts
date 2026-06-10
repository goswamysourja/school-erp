import { prisma } from "@/lib/prisma/client";
import { Role } from "@prisma/client";

interface CreateClassInput {
  name: string;
  section: string;
  academicYear: string;

  tenantId: string;

  classTeacherId?: string;
}

export async function createClass(
  input: CreateClassInput
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

  if (input.classTeacherId) {
    const teacher =
      await prisma.user.findUnique({
        where: {
          id: input.classTeacherId,
        },
      });

    if (!teacher) {
      throw new Error(
        "Teacher not found"
      );
    }

    if (
      teacher.role !==
      Role.TEACHER
    ) {
      throw new Error(
        "Selected user is not a teacher"
      );
    }

    if (!teacher.isActive) {
      throw new Error(
        "Teacher is inactive"
      );
    }

    if (
      teacher.tenantId !==
      input.tenantId
    ) {
      throw new Error(
        "Teacher belongs to another tenant"
      );
    }
  }

  return prisma.class.create({
    data: {
      name: input.name,
      section: input.section,
      academicYear:
        input.academicYear,

      tenantId:
        input.tenantId,

      classTeacherId:
        input.classTeacherId,
    },
  });
}