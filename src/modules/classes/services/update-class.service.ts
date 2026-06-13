import { prisma } from "@/lib/prisma/client";
import { Role } from "@prisma/client";

interface UpdateClassInput {
  id: string;

  name: string;

  section: string;

  academicYear: string;

  tenantId: string;

  classTeacherId?: string;
}

export async function updateClass(
  input: UpdateClassInput
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

  const duplicateClass =
    await prisma.class.findFirst({
      where: {
        tenantId:
          input.tenantId,

        name:
          input.name,

        section:
          input.section,

        academicYear:
          input.academicYear,

        NOT: {
          id: input.id,
        },
      },
    });

  if (duplicateClass) {
    throw new Error(
      "Class already exists"
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

  return prisma.class.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      section:
        input.section,
      academicYear:
        input.academicYear,
      tenantId:
        input.tenantId,
      classTeacherId:
        input.classTeacherId,
    },
  });
}