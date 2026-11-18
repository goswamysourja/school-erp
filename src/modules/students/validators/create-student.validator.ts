import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters.")
    .max(100, "First name cannot exceed 100 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters.")
    .max(100, "Last name cannot exceed 100 characters."),

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

export type CreateStudentInput = z.infer<
  typeof createStudentSchema
>;