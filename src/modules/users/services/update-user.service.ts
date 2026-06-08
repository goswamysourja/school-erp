import { prisma } from "@/lib/prisma/client";

interface UpdateUserInput {
  id: string;
  name: string;
  role:
    | "ADMIN"
    | "TEACHER"
    | "STUDENT";

  tenantId: string;
}

export async function updateUser(
  input: UpdateUserInput
) {
  return prisma.user.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      role: input.role,
      tenantId:
        input.tenantId,
    },
  });
}