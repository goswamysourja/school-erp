import { prisma } from "@/lib/prisma/client";

import { requireActiveTenant } from "@/modules/tenants/guards";

import { generateTenantId } from "@/modules/common/services/generate-id.service";

import {
  requireEligibleTeacherUser,
} from "../guards";

import { mapTeacherResponse } from "../mapper";

import type { CreateTeacherInput } from "../validators";

interface CreateTeacherServiceInput extends CreateTeacherInput {
  tenantId: string;
}

export async function createTeacher(
  input: CreateTeacherServiceInput,
) {
  await requireActiveTenant(input.tenantId);

  const user = await requireEligibleTeacherUser(
    input.userId,
    input.tenantId,
  );

  const teacher = await prisma.$transaction(async (tx) => {
    const employeeId = await generateTenantId(tx, {
      tenantId: input.tenantId,
      sequenceKey: "EMPLOYEE",
      prefix: "EMP",
      padding: 6,
    });

    return tx.teacher.create({
      data: {
        employeeId,

        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,

        dateOfBirth: input.dateOfBirth
          ? new Date(input.dateOfBirth)
          : null,

        address: input.address,
        highestQualification: input.highestQualification,

        joiningDate: input.joiningDate
          ? new Date(input.joiningDate)
          : null,

        tenantId: input.tenantId,
        userId: user.id,
      },

      include: {
        tenant: true,
        user: true,
      },
    });
  });

  return mapTeacherResponse(teacher);
}