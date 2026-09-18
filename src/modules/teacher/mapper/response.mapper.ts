import {
  TeacherResponse,
  TeacherWithRelations,
} from "../types";

export function mapTeacherResponse(
  teacher: TeacherWithRelations,
): TeacherResponse {
 return {
  id: teacher.id,

  employeeId: teacher.employeeId,

  firstName: teacher.firstName,

  lastName: teacher.lastName,

  fullName: `${teacher.firstName} ${teacher.lastName}`,

  gender: teacher.gender,

  dateOfBirth: teacher.dateOfBirth,

  phone: teacher.phone,

  address: teacher.address,

  highestQualification: teacher.highestQualification,

  joiningDate: teacher.joiningDate,

  isActive: teacher.isActive,

  tenantId: teacher.tenantId,

  tenantName: teacher.tenant.name,

  userId: teacher.userId,

  userName: teacher.user.name,

  userPhone: teacher.user.phone,

  createdAt: teacher.createdAt,

  updatedAt: teacher.updatedAt,
};
}