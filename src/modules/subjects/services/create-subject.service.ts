import { prisma } from "@/lib/prisma/client";

import { validateSubjectContext } from "./shared/validate-subject-context.service";

interface CreateSubjectInput {
  name: string;

  code: string;

  description?: string;

  tenantId: string;

  classId: string;
}

export async function createSubject(
  input: CreateSubjectInput
) {
  await validateSubjectContext({
    tenantId: input.tenantId,
    classId: input.classId,
  });

  const existingSubject =
    await prisma.subject.findFirst({
      where: {
        tenantId: input.tenantId,

        classId: input.classId,

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

  return prisma.subject.create({
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