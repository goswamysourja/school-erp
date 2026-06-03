import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: "admin@erp.com",
    },
  });

  if (existingUser) {
    console.log("Super Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(
    "Admin@123",
    10
  );

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@erp.com",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("Super Admin created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });