import { prisma } from "@/lib/prisma/client";

interface CreateTenantInput {
  name: string;
  slug: string;
}

export async function createTenant(
  input: CreateTenantInput
) {
  const existingTenant =
    await prisma.tenant.findUnique({
      where: {
        slug: input.slug,
      },
    });

  if (existingTenant) {
    throw new Error(
      "Tenant slug already exists"
    );
  }

  return prisma.tenant.create({
    data: {
      name: input.name,
      slug: input.slug,
    },
  });
}