import { prisma } from "@/lib/prisma/client";

interface RemoveLibraryStaffInput {
  tenantId: string;
  userId: string;
}

export async function removeLibraryStaff(
  input: RemoveLibraryStaffInput,
) {
  const assignment =
    await prisma.libraryStaffAssignment.findUnique({
      where: {
        tenantId_userId: {
          tenantId: input.tenantId,
          userId: input.userId,
        },
      },
    });

  if (!assignment) {
    throw new Error(
      "Library staff assignment not found in this institution.",
    );
  }

  if (!assignment.isActive) {
    return assignment;
  }

  return prisma.libraryStaffAssignment.update({
    where: {
      tenantId_userId: {
        tenantId: input.tenantId,
        userId: input.userId,
      },
    },

    data: {
      isActive: false,
    },
  });
}