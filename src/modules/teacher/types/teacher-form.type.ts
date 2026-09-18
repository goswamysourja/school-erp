export interface TeacherFormValues {
  employeeId: string;

  firstName: string;

  lastName: string;

  gender: "MALE" | "FEMALE" | "OTHER";

  dateOfBirth?: string;

  phone?: string;

  address?: string;

  highestQualification?: string;

  joiningDate?: string;
}