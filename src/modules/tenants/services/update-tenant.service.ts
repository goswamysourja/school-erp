import { prisma } from "@/lib/prisma/client";

interface UpdateTenantInput {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export async function updateTenant(
  input: UpdateTenantInput
) {
  return prisma.tenant.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      slug: input.slug,
      isActive:
        input.isActive,
    },
  });
}