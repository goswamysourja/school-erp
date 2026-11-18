import type {
  TeacherFormValues,
  TeacherResponse,
} from "../types";

export function mapTeacherToFormValues(
  teacher: TeacherResponse,
): TeacherFormValues {
  return {
    firstName: teacher.firstName,

    lastName: teacher.lastName,

    gender: teacher.gender as
      | "MALE"
      | "FEMALE"
      | "OTHER",

    dateOfBirth: teacher.dateOfBirth
      ? teacher.dateOfBirth.toISOString().split("T")[0]
      : "",

    phone: teacher.userPhone ?? "",

    address: teacher.address ?? "",

    highestQualification:
      teacher.highestQualification ?? "",

    joiningDate: teacher.joiningDate
      ? teacher.joiningDate.toISOString().split("T")[0]
      : "",
  };
}