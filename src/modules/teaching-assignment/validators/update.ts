import { z } from "zod";

export const updateTeachingAssignmentSchema =
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

    subjectId: z
      .string()
      .trim()
      .min(
        1,
        "Subject is required.",
      ),
  });

export type UpdateTeachingAssignmentInput =
  z.infer<
    typeof updateTeachingAssignmentSchema
  >;