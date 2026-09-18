import { prisma } from "@/lib/prisma/client";

export async function getTenants() {
  const tenants = await prisma.tenant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return tenants;
}