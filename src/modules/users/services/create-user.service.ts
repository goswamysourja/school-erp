import { prisma } from "@/lib/prisma/client";

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