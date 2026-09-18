import { z } from "zod";

export const updateClassTeacherAssignmentSchema =
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

export type UpdateClassTeacherAssignmentInput =
  z.infer<
    typeof updateClassTeacherAssignmentSchema
  >;