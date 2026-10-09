import { z } from "zod";

export const teacherFormSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(
      1,
      "Employee ID is required.",
    )
    .max(
      30,
      "Employee ID cannot exceed 30 characters.",
    ),

  firstName: z
    .string()
    .trim()
    .min(
      2,
      "First name must contain at least 2 characters.",
    )
    .max(
      100,
      "First name cannot exceed 100 characters.",
    ),

  lastName: z
    .string()
    .trim()
    .min(
      2,
      "Last name must contain at least 2 characters.",
    )
    .max(
      100,
      "Last name cannot exceed 100 characters.",
    ),

  gender: z.enum(
    ["MALE", "FEMALE", "OTHER"],
    {
      message:
        "Please select a valid gender.",
    },
  ),

  dateOfBirth: z
    .string()
    .date()
    .optional(),

  phone: z
    .string()
    .trim()
    .max(
      20,
      "Phone number cannot exceed 20 characters.",
    )
    .optional(),

  address: z
    .string()
    .trim()
    .max(
      500,
      "Address cannot exceed 500 characters.",
    )
    .optional(),

  highestQualification: z
    .string()
    .trim()
    .max(
      200,
      "Qualification cannot exceed 200 characters.",
    )
    .optional(),

  joiningDate: z
    .string()
    .date()
    .optional(),
});

export const createTeacherSchema =
  teacherFormSchema
    .extend({
      userId: z
        .string()
        .cuid("Invalid user id."),
    })
    .omit({
      phone: true,
    });

export type CreateTeacherInput =
  z.infer<
    typeof createTeacherSchema
  >;

export type TeacherFormInput =
  z.infer<
    typeof teacherFormSchema
  >;