import { z } from "zod";

export const updateStudentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  gender: z.enum([
    "MALE",
    "FEMALE",
    "OTHER",
  ]),

  dateOfBirth: z.string().optional(),

  guardianName: z.string().trim().optional(),

  phone: z.string().trim().optional(),

  address: z.string().trim().optional(),

  sectionId: z.string().cuid("Invalid section ID."),
});

export type UpdateStudentInput = z.infer<
  typeof updateStudentSchema
>;