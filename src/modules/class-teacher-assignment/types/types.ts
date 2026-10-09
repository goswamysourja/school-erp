import type { Prisma } from "@prisma/client";

export type ClassTeacherAssignmentResponse =
  Prisma.ClassTeacherAssignmentGetPayload<{
    include: {
      teacher: true;
      section: {
        include: {
          class: true;
        };
      };
    };
  }>;

export interface ClassTeacherTeacherOption {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface ClassTeacherSectionOption {
  id: string;
  name: string;
  isActive: boolean;
  class: {
    id: string;
    name: string;
    academicYear: string;
    academicYearId: string | null;
    isActive: boolean;
  };
}