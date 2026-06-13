import { prisma } from "@/lib/prisma/client";
import { requireTenantAssignment } from "@/modules/auth/guards/require-tenant-assignment.guard";



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
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: input.tenantId,
      },
    });

   requireTenantAssignment(
  input.role,
  input.tenantId
); 

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