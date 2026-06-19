import { prisma }
  from "@/lib/prisma/client";

export async function getDashboardStats() {
  const [
    users,
    tenants,
    classes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tenant.count(),
    prisma.class.count(),
  ]);

  return {
    users,
    tenants,
    classes,
  };
}