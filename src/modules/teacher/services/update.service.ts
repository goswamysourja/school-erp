import { prisma } from "@/lib/prisma/client";

import { requireActiveTenant } from "@/modules/tenants/guards";

import {
  requireTeacherExists,
  requireUniqueEmployeeId,
} from "../guards";

import { mapTeacherResponse } from "../mapper";

import type {
  UpdateTeacherInput,
} from "../validators";

export async function updateTeacher(
  teacherId: string,
  tenantId: string,
  input: UpdateTeacherInput,
) {
  const teacher =
    await requireTeacherExists(
      teacherId,
    );

  if (
    teacher.tenantId !==
    tenantId
  ) {
    throw new Error(
      "Teacher does not belong to this tenant.",
    );
  }

  await requireActiveTenant(
    teacher.tenantId,
  );

  if (
    teacher.employeeId !==
    input.employeeId
  ) {
    await requireUniqueEmployeeId(
      input.employeeId,
      teacher.tenantId,
      teacher.id,
    );
  }

  const updatedTeacher =
    await prisma.teacher.update({
      where: {
        id: teacher.id,
      },

      data: {
        employeeId:
          input.employeeId,

        firstName:
          input.firstName,

        lastName:
          input.lastName,

        gender:
          input.gender,

        dateOfBirth:
          input.dateOfBirth
            ? new Date(
                input.dateOfBirth,
              )
            : undefined,

        address:
          input.address,

        highestQualification:
          input.highestQualification,

        joiningDate:
          input.joiningDate
            ? new Date(
                input.joiningDate,
              )
            : undefined,
      },

      include: {
        tenant: true,
        user: true,
      },
    });

  return mapTeacherResponse(
    updatedTeacher,
  );
}