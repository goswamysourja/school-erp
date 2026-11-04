import {
  Role,
  StaffDesignation,
} from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

import { requireTenantAssignment } from "@/modules/auth/guards/require-tenant-assignment.guard";

interface CreateUserInput {
  name: string;
  phone: string;
  designation: StaffDesignation;
  tenantId: string;
}

export async function createUser(
  input: CreateUserInput,
) {
  const existingUser = await prisma.user.findUnique({
    where: {
      phone: input.phone,
    },
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  requireTenantAssignment(
    Role.STAFF,
    input.tenantId,
  );

  const tenant = await prisma.tenant.findUnique({
    where: {
      id: input.tenantId,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  return prisma.user.create({
    data: {
      name: input.name,
      phone: input.phone,
      role: Role.STAFF,
      designation: input.designation,
      tenantId: input.tenantId,
      isActive: true,
    },
  });
}