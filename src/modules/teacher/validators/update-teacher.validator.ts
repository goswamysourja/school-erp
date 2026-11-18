import { z } from "zod";

export const updateTeacherSchema = z.object({
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

  gender: z.enum(
    ["MALE", "FEMALE", "OTHER"],
    {
      message: "Please select a valid gender.",
    },
  ),

  dateOfBirth: z.string().date().optional(),

  address: z
    .string()
    .trim()
    .max(500, "Address cannot exceed 500 characters.")
    .optional(),

  highestQualification: z
    .string()
    .trim()
    .max(200, "Qualification cannot exceed 200 characters.")
    .optional(),

  joiningDate: z.string().date().optional(),
});

export type UpdateTeacherInput = z.infer<
  typeof updateTeacherSchema
>;