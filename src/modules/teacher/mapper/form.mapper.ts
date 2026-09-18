import type {
  TeacherFormValues,
  TeacherResponse,
} from "../types";

export function mapTeacherToFormValues(
  teacher: TeacherResponse,
): TeacherFormValues {
  return {
    employeeId: teacher.employeeId,

    firstName: teacher.firstName,

    lastName: teacher.lastName,

    gender: teacher.gender as
      "MALE" | "FEMALE" | "OTHER",

    dateOfBirth: teacher.dateOfBirth
      ? teacher.dateOfBirth
          .toISOString()
          .split("T")[0]
      : "",

    phone: teacher.phone ?? "",

    address: teacher.address ?? "",

    highestQualification:
      teacher.highestQualification ?? "",

    joiningDate: teacher.joiningDate
      ? teacher.joiningDate
          .toISOString()
          .split("T")[0]
      : "",

    // userId: teacher.userId,
  };
}