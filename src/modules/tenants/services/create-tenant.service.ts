import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface CreateTenantInput {
  name: string;
  adminName: string;
  adminPhone: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTenant({
  name,
  adminName,
  adminPhone,
}: CreateTenantInput) {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 2;

  while (
    await prisma.tenant.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
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
