import {
  PrismaClient,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const phone =
    "+919674567809";

  const existingUser =
    await prisma.user.findUnique({
      where: {
        phone,
      },
    });

  if (existingUser) {
    console.log(
      "Super Admin already exists.",
    );
    return;
  }

  await prisma.user.create({
    data: {
      name: "Super Admin",
      phone,
      role: Role.SUPER_ADMIN,
      tenantId: null,
      isActive: true,
    },
  });

  console.log(
    "Super Admin created successfully.",
  );
}

main()
  .catch((error) => {
    console.error(
      "Seed failed:",
      error,
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });