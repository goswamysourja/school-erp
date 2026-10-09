import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const classes = await prisma.class.findMany({
    where: {
      academicYearId: null,
    },
    select: {
      id: true,
      name: true,
      academicYear: true,
      tenantId: true,
    },
  });

  console.log(
    `Found ${classes.length} class(es) without academicYearId.`,
  );

  if (classes.length === 0) {
    console.log("Nothing to backfill.");
    return;
  }

  const updates: {
    classId: string;
    className: string;
    academicYearId: string;
    academicYearName: string;
  }[] = [];

  for (const classItem of classes) {
    const academicYear =
      await prisma.academicYear.findFirst({
        where: {
          tenantId: classItem.tenantId,
          name: classItem.academicYear,
        },
        select: {
          id: true,
          name: true,
        },
      });

    if (!academicYear) {
      throw new Error(
        `No matching Academic Year found for Class "${classItem.name}" with academicYear "${classItem.academicYear}" in tenant "${classItem.tenantId}".`,
      );
    }

    updates.push({
      classId: classItem.id,
      className: classItem.name,
      academicYearId: academicYear.id,
      academicYearName: academicYear.name,
    });
  }

  await prisma.$transaction(
    updates.map((update) =>
      prisma.class.update({
        where: {
          id: update.classId,
        },
        data: {
          academicYearId:
            update.academicYearId,
        },
      }),
    ),
  );

  for (const update of updates) {
    console.log(
      `Linked Class "${update.className}" → Academic Year "${update.academicYearName}"`,
    );
  }

  console.log("Academic Year backfill completed successfully.");
}

main()
  .catch((error) => {
    console.error(
      "Backfill failed:",
      error,
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });