import { z } from "zod";

export const createMarkSchema =
  z
    .object({
      studentId: z
        .string()
        .trim()
        .min(1, "Student is required."),

      teachingAssignmentId: z
        .string()
        .trim()
        .min(1, "Teaching assignment is required."),

      academicPeriodId: z
        .string()
        .trim()
        .min(1, "Academic period is required."),

      marks: z.coerce
        .number({
          message: "Valid marks are required.",
        })
        .min(
          0,
          "Marks cannot be negative.",
        ),

      maxMarks: z.coerce
        .number({
          message:
            "Valid maximum marks are required.",
        })
        .gt(
          0,
          "Maximum marks must be greater than 0.",
        ),
    })
    .refine(
      (data) =>
        data.marks <= data.maxMarks,
      {
        path: ["marks"],
        message:
          "Marks cannot be greater than maximum marks.",
      },
    );

export type CreateMarkInput =
  z.infer<
    typeof createMarkSchema
  >;

export const updateMarkSchema =
  createMarkSchema;

export type UpdateMarkInput =
  z.infer<
    typeof updateMarkSchema
  >;