export interface MarkStudentResponse {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  sectionId: string | null;

  section: {
    id: string;
    name: string;

    class: {
      id: string;
      name: string;
      academicYear: string;
      academicYearId: string | null;
    } | null;
  } | null;
}

export interface MarkTeacherResponse {
  id: string;
  firstName: string;
  lastName: string;
}

export interface MarkSubjectResponse {
  id: string;
  name: string;
  code: string;
}

export interface MarkAssignmentResponse {
  id: string;
  teacher: MarkTeacherResponse;
  section: {
    id: string;
    name: string;

    class: {
      id: string;
      name: string;
      academicYear: string;
      academicYearId: string | null;
    };
  };
  subject: MarkSubjectResponse;
}

export interface MarkAcademicYearResponse {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface MarkAcademicPeriodResponse {
  id: string;
  name: string;
  type: "TERM" | "EXAM";
  startDate: Date;
  endDate: Date;
  marksUploadOpen: boolean;
  marksLockedAt: Date | null;
  academicYearId: string;

  academicYear: MarkAcademicYearResponse;
}

export interface MarkResponse {
  id: string;
  tenantId: string;

  studentId: string;
  teachingAssignmentId: string;
  academicPeriodId: string;

  marks: number;
  maxMarks: number;

  createdAt: Date;
  updatedAt: Date;

  student: MarkStudentResponse;

  teachingAssignment: MarkAssignmentResponse;

  academicPeriod: MarkAcademicPeriodResponse;
}