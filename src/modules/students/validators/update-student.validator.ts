import { z } from "zod";

export const updateStudentSchema =
  z.object({
    admissionNumber: z
      .string()
      .min(1),

    firstName: z
      .string()
      .min(2)
      .max(100),

    lastName: z
      .string()
      .min(2)
      .max(100),

    gender: z.enum([
      "MALE",
      "FEMALE",
      "OTHER",
    ]),

    dateOfBirth:
      z.string().optional(),

    guardianName:
      z.string().optional(),

    phone:
      z.string().optional(),

    address:
      z.string().optional(),

    sectionId:
      z.string(),
  });

export type UpdateStudentInput =
  z.infer<
    typeof updateStudentSchema
  >;