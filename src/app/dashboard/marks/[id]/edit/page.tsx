import { notFound } from "next/navigation";

import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getMark } from "@/modules/marks/services/get.service";
import { mapMark } from "@/modules/marks/mapper/mapper";

import { getStudents } from "@/modules/students/services/get-students.service";

import { listTeachingAssignments } from "@/modules/teaching-assignment/services";

import { getAcademicYears } from "@/modules/academic-year/services/get.service";
import { getAcademicPeriods } from "@/modules/academic-year/services/period.get.service";

import type { AcademicYearResponse } from "@/modules/academic-year/types/types";
import type { AcademicPeriodResponse } from "@/modules/academic-year/types/period.types";

import { EditMarkForm } from "@/modules/marks/components/edit-form";

import { PageHeader } from "@/components/ui/page-header";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMarkPage({
  params,
}: Props) {
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

  const { id } =
    await params;

  const tenantId =
    currentUser.tenantId;

  const teacherId =
    currentUser.role === Role.TEACHER
      ? currentUser.teacher?.id
      : undefined;

  const mark =
    await getMark({
      id,
      tenantId,
      teacherId,
    });

  if (!mark) {
    notFound();
  }

  if (
    !mark.academicPeriod.marksUploadOpen
  ) {
    return (
      <>
        <PageHeader
          title="Edit Marks"
          subtitle="Marks cannot be modified while the upload window is closed."
        />

        <div
          style={{
            padding: "24px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <h2>
            Marks Upload is Closed
          </h2>

          <p>
            The marks for{" "}
            <strong>
              {mark.academicPeriod.name}
            </strong>{" "}
            in academic year{" "}
            <strong>
              {mark.academicPeriod.academicYear.name}
            </strong>{" "}
            are currently locked.
          </p>

          <p>
            Editing is disabled until the marks
            upload window is opened again.
          </p>
        </div>
      </>
    );
  }

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

  const mappedMark =
    mapMark(mark);

  return (
    <>
      <PageHeader
        title="Edit Marks"
        subtitle="Update student marks for an academic period."
      />

      <EditMarkForm
        id={mappedMark.id}
        initialStudentId={
          mappedMark.studentId
        }
        initialTeachingAssignmentId={
          mappedMark.teachingAssignmentId
        }
        initialAcademicPeriodId={
          mappedMark.academicPeriodId
        }
        initialMarks={
          mappedMark.marks
        }
        initialMaxMarks={
          mappedMark.maxMarks
        }
        students={students}
        teachingAssignments={
          teachingAssignments
        }
        academicPeriods={
          academicPeriods
        }
      />
    </>
  );
}