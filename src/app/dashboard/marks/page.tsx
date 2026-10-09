import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { listMarks } from "@/modules/marks/services/list.service";

import { mapMarks } from "@/modules/marks/mapper/mapper";

import { MarkList } from "@/modules/marks/components/list";

import { getAcademicYears } from "@/modules/academic-year/services/get.service";
import { getAcademicPeriods } from "@/modules/academic-year/services/period.get.service";

import { PageHeader } from "@/components/ui/page-header";

import {
  Alert,
  Button,
  Stack,
} from "@mui/material";

export default async function MarksPage() {
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

  const classTeacherSectionIds =
    currentUser.role === Role.TEACHER &&
    currentUser.teacher
      ? currentUser.teacher.classTeacherAssignments.map(
          (assignment) =>
            assignment.sectionId,
        )
      : [];

  const [
    marks,
    academicYears,
  ] = await Promise.all([
    listMarks({
      tenantId,

      teacherId,

      classTeacherSectionIds,
    }),

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
    periodsPerYear.flat();

  const hasOpenAcademicPeriod =
    academicPeriods.some(
      (period) =>
        period.marksUploadOpen,
    );

  const mappedMarks =
    mapMarks(marks);

  return (
    <>
      <PageHeader
        title="Marks"
        subtitle="Manage student marks and academic results."
      />

      <Stack
        spacing={2}
        sx={{ mb: 3 }}
      >
        {hasOpenAcademicPeriod ? (
          <Button
            href="/dashboard/marks/create"
            variant="contained"
            sx={{
              alignSelf: "flex-start",
            }}
          >
            Enter Marks
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="warning"
              disabled
              sx={{
                alignSelf: "flex-start",
              }}
            >
              Marks Upload Closed
            </Button>

            <Alert severity="warning">
              Marks upload is currently
              closed. Open an Academic
              Period before entering new
              marks.
            </Alert>
          </>
        )}
      </Stack>

      <MarkList
        marks={mappedMarks}
        teacherId={teacherId}
      />
    </>
  );
}