import { prisma } from "@/lib/prisma/client";

import { validateSubjectContext } from "./shared/validate-subject-context.service";

interface UpdateSubjectInput {
  id: string;

  name: string;

  code: string;

  description?: string;

  tenantId: string;

  classId: string;
}

export async function updateSubject(
  input: UpdateSubjectInput
) {
  const subject =
    await prisma.subject.findUnique({
      where: {
        id: input.id,
      },
    });

  if (!subject) {
    throw new Error(
      "Subject not found"
    );
  }

  await validateSubjectContext({
    tenantId: input.tenantId,
    classId: input.classId,
  });

  const existingSubject =
    await prisma.subject.findFirst({
      where: {
        tenantId: input.tenantId,

        classId: input.classId,

        NOT: {
          id: input.id,
        },

        OR: [
          {
            code: input.code,
          },
          {
            name: input.name,
          },
        ],
      },
    });

  if (existingSubject) {
    if (
      existingSubject.code ===
      input.code
    ) {
      throw new Error(
        "Subject code already exists"
      );
    }

    throw new Error(
      "Subject name already exists"
    );
  }

  return prisma.subject.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,

      code: input.code,

      description:
        input.description,

      tenantId:
        input.tenantId,

      classId:
        input.classId,
    },
  });
}