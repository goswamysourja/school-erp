import { prisma } from "@/lib/prisma/client";

import { requireActiveTenant } from "@/modules/tenants/guards";

import {
  requireEligibleTeacherUser,
  requireUniqueEmployeeId,
} from "../guards";

import { mapTeacherResponse } from "../mapper";

import type {
  CreateTeacherInput,
} from "../validators";

interface CreateTeacherServiceInput
  extends CreateTeacherInput {
  tenantId: string;
}

export async function createTeacher(
  input: CreateTeacherServiceInput,
) {
  await requireActiveTenant(
    input.tenantId,
  );

  const user =
    await requireEligibleTeacherUser(
      input.userId,
      input.tenantId,
    );

  await requireUniqueEmployeeId(
    input.employeeId,
    input.tenantId,
  );

  const teacher =
    await prisma.teacher.create({
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
            : null,

        phone:
          input.phone,

        address:
          input.address,

        highestQualification:
          input.highestQualification,

        joiningDate:
          input.joiningDate
            ? new Date(
                input.joiningDate,
              )
            : null,

        tenantId:
          input.tenantId,

        userId:
          user.id,
      },

      include: {
        tenant: true,
        user: true,
      },
    });

  return mapTeacherResponse(
    teacher,
  );
}