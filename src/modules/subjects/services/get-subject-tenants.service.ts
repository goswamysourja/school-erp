import { prisma } from "@/lib/prisma/client";

export async function getSubjectTenants() {
  return prisma.tenant.findMany({
   where: {
  status: "ACTIVE",
},
    orderBy: {
      name: "asc",
    },
  });
}