import { prisma } from "@/lib/prisma/client";

export async function getSuperAdminDashboardStats() {
  const [
    totalTenants,
    pendingTenants,
    activeTenants,
    suspendedTenants,
  ] = await Promise.all([
    prisma.tenant.count(),

    prisma.tenant.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.tenant.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.tenant.count({
      where: {
        status: "SUSPENDED",
      },
    }),
  ]);

  return {
    totalTenants,
    pendingTenants,
    activeTenants,
    suspendedTenants,
  };
}

export async function getAdminDashboardStats(
  tenantId: string,
) {
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    totalSections,
    totalSubjects,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        tenantId,
      },
    }),

    prisma.teacher.count({
      where: {
        tenantId,
      },
    }),

    prisma.class.count({
      where: {
        tenantId,
      },
    }),

    prisma.section.count({
      where: {
        tenantId,
      },
    }),

    prisma.subject.count({
      where: {
        tenantId,
      },
    }),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    totalSections,
    totalSubjects,
  };
}

export async function getTeacherDashboardStats(
  userId: string,
) {
  const teacher =
    await prisma.teacher.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,

        teachingAssignments: {
          select: {
            sectionId: true,
            subjectId: true,
          },
        },

        classTeacherAssignments: {
          select: {
            sectionId: true,
          },
        },
      },
    });

  if (!teacher) {
    throw new Error(
      "Teacher profile not found.",
    );
  }

  const teachingSectionIds =
    teacher.teachingAssignments.map(
      (assignment) =>
        assignment.sectionId,
    );

  const classTeacherSectionIds =
    teacher.classTeacherAssignments.map(
      (assignment) =>
        assignment.sectionId,
    );

  const assignedSectionIds = [
    ...new Set([
      ...teachingSectionIds,
      ...classTeacherSectionIds,
    ]),
  ];

  const teachingSubjectIds = [
    ...new Set(
      teacher.teachingAssignments.map(
        (assignment) =>
          assignment.subjectId,
      ),
    ),
  ];

  const classTeacherSections = [
    ...new Set(
      classTeacherSectionIds,
    ),
  ];

  const totalStudents =
    await prisma.student.count({
      where: {
        sectionId: {
          in: assignedSectionIds,
        },
      },
    });

  return {
    assignedSections:
      assignedSectionIds.length,

    subjectsTaught:
      teachingSubjectIds.length,

    classTeacherSections:
      classTeacherSections.length,

    totalStudents,
  };
}