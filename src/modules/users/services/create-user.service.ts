import { prisma } from "@/lib/prisma/client";
import { requireTenantAssignment }
  from "@/modules/auth/guards/require-tenant-assignment.guard";

interface CreateUserInput {
  name: string;
  email: string;
  role:
  | "ADMIN"
  | "TEACHER"
  | "STUDENT";

  tenantId: string;
}



export async function createUser(
  input: CreateUserInput
) {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  requireTenantAssignment(
    input.role,
    input.tenantId
  );

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

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      tenantId:
        input.tenantId,
      isActive: true,
    },
  });
}