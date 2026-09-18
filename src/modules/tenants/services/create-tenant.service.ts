import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface CreateTenantInput {
  name: string;
  slug: string;
  adminName: string;
  adminPhone: string;
}

export async function createTenant({
  name,
  slug,
  adminName,
  adminPhone,
}: CreateTenantInput) {
  const existingTenant =
    await prisma.tenant.findUnique({
      where: {
        slug,
      },
    });

  if (existingTenant) {
    throw new Error(
      "A tenant with this slug already exists.",
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        phone: adminPhone,
      },
    });

  if (existingUser) {
    throw new Error(
      "A user with this phone number already exists.",
    );
  }

  const result =
    await prisma.$transaction(
      async (tx) => {
        const adminUser =
          await tx.user.create({
            data: {
              name: adminName,
              phone: adminPhone,
              role: Role.ADMIN,
              isActive: true,
            },
          });

        const tenant =
          await tx.tenant.create({
            data: {
              name,
              slug,
              status: "PENDING_ADMIN",
              adminUserId: adminUser.id,
            },
          });

        await tx.user.update({
          where: {
            id: adminUser.id,
          },
          data: {
            tenantId: tenant.id,
          },
        });

        return {
          tenant,
          adminUser,
        };
      },
    );

  return result;
}