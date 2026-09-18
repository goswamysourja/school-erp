import { prisma } from "@/lib/prisma/client";

export async function requireExists(
  assignmentId: string,
) {
  const assignment =
    await prisma.classTeacherAssignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

  if (!assignment) {
    throw new Error(
      "Class teacher assignment not found.",
    );
  }

  return assignment;
}