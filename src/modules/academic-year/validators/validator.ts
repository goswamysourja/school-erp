import { z } from "zod";

export const createAcademicYearSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Academic year name is required.")
      .max(50, "Academic year name is too long."),

    startDate: z.coerce.date({
      message: "Valid start date is required.",
    }),

    endDate: z.coerce.date({
      message: "Valid end date is required.",
    }),
  })
  .refine((data) => data.startDate < data.endDate, {
    path: ["endDate"],
    message: "Academic year end date must be after the start date.",
  });

export type CreateAcademicYearInput = z.infer<
  typeof createAcademicYearSchema
>;

export const createAcademicPeriodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Academic period name is required.")
      .max(100, "Academic period name is too long."),

    type: z.enum(["TERM", "EXAM"]),

    startDate: z.coerce.date({
      message: "Valid start date is required.",
    }),

    endDate: z.coerce.date({
      message: "Valid end date is required.",
    }),

    academicYearId: z
      .string()
      .trim()
      .min(1, "Academic year is required."),
  })
  .refine((data) => data.startDate < data.endDate, {
    path: ["endDate"],
    message: "Academic period end date must be after the start date.",
  });

export type CreateAcademicPeriodInput = z.infer<
  typeof createAcademicPeriodSchema
>;