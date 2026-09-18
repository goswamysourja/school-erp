import { prisma } from "@/lib/prisma/client";

interface CreateSubjectInput {
  name: string;

  code: string;

  description?: string;

  tenantId: string;
}

export async function createSubject(
  input: CreateSubjectInput
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

  const existingSubject =
    await prisma.subject.findFirst({
      where: {
        tenantId:
          input.tenantId,

        OR: [
          {
            code:
              input.code,
          },
          {
            name:
              input.name,
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
      name:
        input.name,

      code:
        input.code,

      description:
        input.description,

      tenantId:
        input.tenantId,
    },
  });
}