import { Prisma } from "@prisma/client";

export type TeacherWithRelations =
  Prisma.TeacherGetPayload<{
    include: {
      tenant: true;
      user: true;
    };
  }>;

export interface TeacherResponse {
  id: string;

  employeeId: string;

  firstName: string;

  lastName: string;

  fullName: string;

  gender: string;

  dateOfBirth: Date | null;

  address: string | null;

  highestQualification: string | null;

  joiningDate: Date | null;

  isActive: boolean;

  tenantId: string;

  tenantName: string;

  userId: string;

  userName: string;

  userPhone: string;

  createdAt: Date;

  updatedAt: Date;
}