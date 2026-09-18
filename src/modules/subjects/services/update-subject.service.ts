import { prisma } from "@/lib/prisma/client";

interface UpdateSubjectInput {
  id: string;

  name: string;

  code: string;

  description?: string;

  tenantId: string;
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

  if (
    subject.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Subject belongs to another tenant"
    );
  }

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

        NOT: {
          id: input.id,
        },

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

  return prisma.subject.update({
    where: {
      id: subject.id,
    },

    data: {
      name:
        input.name,

      code:
        input.code,

      description:
        input.description,
    },
  });
}