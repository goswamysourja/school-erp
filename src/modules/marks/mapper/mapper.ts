import type { MarkResponse } from "../types/types";

export function mapMark(
  mark: any,
): MarkResponse {
  return {
    id: mark.id,
    tenantId: mark.tenantId,

    studentId: mark.studentId,
    teachingAssignmentId:
      mark.teachingAssignmentId,
    academicPeriodId:
      mark.academicPeriodId,

    marks: Number(mark.marks),
    maxMarks: Number(mark.maxMarks),

    createdAt: mark.createdAt,
    updatedAt: mark.updatedAt,

    student: {
      id: mark.student.id,
      admissionNumber:
        mark.student.admissionNumber,
      firstName: mark.student.firstName,
      lastName: mark.student.lastName,
      sectionId: mark.student.sectionId,

      section: mark.student.section
        ? {
            id: mark.student.section.id,
            name: mark.student.section.name,

            class:
              mark.student.section.class
                ? {
                    id: mark.student.section.class.id,
                    name: mark.student.section.class.name,
                    academicYear:
                      mark.student.section.class
                        .academicYear,
                    academicYearId:
                      mark.student.section.class
                        .academicYearId,
                  }
                : null,
          }
        : null,
    },

    teachingAssignment: {
      id: mark.teachingAssignment.id,

      teacher: {
        id: mark.teachingAssignment.teacher.id,
        firstName:
          mark.teachingAssignment.teacher
            .firstName,
        lastName:
          mark.teachingAssignment.teacher
            .lastName,
      },

      section: {
        id: mark.teachingAssignment.section.id,
        name: mark.teachingAssignment.section.name,

        class: {
          id:
            mark.teachingAssignment.section.class
              .id,
          name:
            mark.teachingAssignment.section.class
              .name,
          academicYear:
            mark.teachingAssignment.section.class
              .academicYear,
          academicYearId:
            mark.teachingAssignment.section.class
              .academicYearId,
        },
      },

      subject: {
        id: mark.teachingAssignment.subject.id,
        name: mark.teachingAssignment.subject.name,
        code: mark.teachingAssignment.subject.code,
      },
    },

    academicPeriod: {
      id: mark.academicPeriod.id,
      name: mark.academicPeriod.name,
      type: mark.academicPeriod.type,
      startDate: mark.academicPeriod.startDate,
      endDate: mark.academicPeriod.endDate,
      marksUploadOpen:
        mark.academicPeriod.marksUploadOpen,
      marksLockedAt:
        mark.academicPeriod.marksLockedAt,
      academicYearId:
        mark.academicPeriod.academicYearId,

      academicYear: {
        id: mark.academicPeriod.academicYear.id,
        name: mark.academicPeriod.academicYear.name,
        startDate:
          mark.academicPeriod.academicYear
            .startDate,
        endDate:
          mark.academicPeriod.academicYear.endDate,
        isActive:
          mark.academicPeriod.academicYear
            .isActive,
      },
    },
  };
}

export function mapMarks(
  marks: any[],
): MarkResponse[] {
  return marks.map(mapMark);
}