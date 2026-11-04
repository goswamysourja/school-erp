import { prisma } from "@/lib/prisma/client";

interface GetLibraryStaffInput {
  tenantId: string;
  activeOnly?: boolean;
}

export async function getLibraryStaff(
  input: GetLibraryStaffInput,
) {
  return prisma.libraryStaffAssignment.findMany({
    where: {
      tenantId: input.tenantId,
      ...(input.activeOnly ? { isActive: true } : {}),
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          designation: true,
          isActive: true,
          teacher: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}