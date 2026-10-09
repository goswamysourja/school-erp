import { prisma } from "@/lib/prisma/client";

interface MarksWindowInput {
  id: string;
  academicYearId: string;
  tenantId: string;
}

async function getPeriod({
  id,
  academicYearId,
  tenantId,
}: MarksWindowInput) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  const academicPeriod = await prisma.academicPeriod.findFirst({
    where: {
      id,
      academicYearId,
      tenantId,
    },
  });

  if (!academicPeriod) {
    throw new Error("Academic period not found.");
  }

  return academicPeriod;
}

export async function openMarksUploadWindow(input: MarksWindowInput) {
  const academicPeriod = await getPeriod(input);

  if (academicPeriod.marksUploadOpen) {
    throw new Error("Marks upload window is already open.");
  }

  return prisma.academicPeriod.update({
    where: {
      id: academicPeriod.id,
    },
    data: {
      marksUploadOpen: true,
      marksLockedAt: null,
    },
  });
}

export async function lockMarksUploadWindow(input: MarksWindowInput) {
  const academicPeriod = await getPeriod(input);

  if (!academicPeriod.marksUploadOpen) {
    throw new Error("Marks upload window is already closed.");
  }

  return prisma.academicPeriod.update({
    where: {
      id: academicPeriod.id,
    },
    data: {
      marksUploadOpen: false,
      marksLockedAt: new Date(),
    },
  });
}