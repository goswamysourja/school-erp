import { prisma } from "@/lib/prisma/client";

export async function requireExists(
  assignmentId: string,
) {
  const assignment =
    await prisma.teachingAssignment.findUnique({
      where: {
        id: assignmentId,
      },
    });

  if (!assignment) {
    throw new Error(
      "Teaching assignment not found.",
    );
  }

  return assignment;
}