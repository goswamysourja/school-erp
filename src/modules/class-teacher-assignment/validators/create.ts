import { z } from "zod";

export const createClassTeacherAssignmentSchema =
  z.object({
    teacherId: z
      .string()
      .trim()
      .min(
        1,
        "Teacher is required.",
      ),

    sectionId: z
      .string()
      .trim()
      .min(
        1,
        "Section is required.",
      ),
  });

export type CreateClassTeacherAssignmentInput =
  z.infer<
    typeof createClassTeacherAssignmentSchema
  >;