import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getStudents } from "@/modules/students/services/get-students.service";

import { listTeachingAssignments } from "@/modules/teaching-assignment/services";

import { getAcademicYears } from "@/modules/academic-year/services/get.service";
import { getAcademicPeriods } from "@/modules/academic-year/services/period.get.service";

import type { AcademicYearResponse } from "@/modules/academic-year/types/types";
import type { AcademicPeriodResponse } from "@/modules/academic-year/types/period.types";

import { MarkForm } from "@/modules/marks/components/form";

import { PageHeader } from "@/components/ui/page-header";

import {
  Alert,
  Button,
} from "@mui/material";

export default async function CreateMarkPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
      Role.TEACHER,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  if (
    currentUser.role === Role.TEACHER &&
    !currentUser.teacher
  ) {
    throw new Error(
      "Teacher profile not found.",
    );
  }

  const tenantId =
    currentUser.tenantId;

  const teacherId =
    currentUser.role === Role.TEACHER
      ? currentUser.teacher?.id
      : undefined;

  const [
    students,
    teachingAssignments,
    academicYears,
  ] = await Promise.all([
    getStudents(
      tenantId,
      teacherId,
    ),

    listTeachingAssignments(
      tenantId,
      teacherId,
    ),

    getAcademicYears({
      tenantId,
    }),
  ]);

  const periodsPerYear =
    await Promise.all(
      academicYears.map(
        (academicYear) =>
          getAcademicPeriods({
            academicYearId:
              academicYear.id,

            tenantId,

            teacherId,
          }),
      ),
    );

  const academicPeriods =
    periodsPerYear
      .flat()
      .map(
        (
          period: AcademicPeriodResponse,
        ) => {
          const academicYear =
            academicYears.find(
              (
                year: AcademicYearResponse,
              ) =>
                year.id ===
                period.academicYearId,
            );

          if (!academicYear) {
            throw new Error(
              "Academic year not found for academic period.",
            );
          }

          return {
            ...period,

            academicYear: {
              name: academicYear.name,
            },
          };
        },
      );

  const openAcademicPeriods =
    academicPeriods.filter(
      (period) =>
        period.marksUploadOpen,
    );

  if (
    openAcademicPeriods.length ===
    0
  ) {
    return (
      <>
        <PageHeader
          title="Enter Marks"
          subtitle="Record student marks for an academic period."
        />

        <Alert
          severity="warning"
          sx={{ mb: 3 }}
        >
          Marks upload is currently
          closed. An Academic Period must
          be open before new marks can be
          entered.
        </Alert>

        <Button
          href="/dashboard/marks"
          variant="outlined"
        >
          Back to Marks
        </Button>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Enter Marks"
        subtitle="Record student marks for an academic period."
      />

      <MarkForm
        students={students}
        teachingAssignments={
          teachingAssignments
        }
        academicPeriods={
          openAcademicPeriods
        }
      />
    </>
  );
}