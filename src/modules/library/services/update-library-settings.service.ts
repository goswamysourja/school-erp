
import { prisma } from "@/lib/prisma/client";

interface UpdateLibrarySettingsInput {
  tenantId: string;
  maxBooksPerStudent?: number;
  loanPeriodDays?: number;
  renewalLimit?: number;
  gracePeriodDays?: number;
  finePerDay?: number;
  lostBookCharge?: number;
  damagedBookCharge?: number;
}

export async function updateLibrarySettings(
  input: UpdateLibrarySettingsInput,
) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: input.tenantId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  const data: {
    maxBooksPerStudent?: number;
    loanPeriodDays?: number;
    renewalLimit?: number;
    gracePeriodDays?: number;
    finePerDay?: number;
    lostBookCharge?: number;
    damagedBookCharge?: number;
  } = {};

  if (input.maxBooksPerStudent !== undefined) {
    if (
      !Number.isInteger(input.maxBooksPerStudent) ||
      input.maxBooksPerStudent < 1
    ) {
      throw new Error(
        "Maximum books per student must be a positive integer.",
      );
    }

    data.maxBooksPerStudent = input.maxBooksPerStudent;
  }

  if (input.loanPeriodDays !== undefined) {
    if (
      !Number.isInteger(input.loanPeriodDays) ||
      input.loanPeriodDays < 1
    ) {
      throw new Error(
        "Loan period must be a positive integer.",
      );
    }

    data.loanPeriodDays = input.loanPeriodDays;
  }

  if (input.renewalLimit !== undefined) {
    if (
      !Number.isInteger(input.renewalLimit) ||
      input.renewalLimit < 0
    ) {
      throw new Error(
        "Renewal limit must be a non-negative integer.",
      );
    }

    data.renewalLimit = input.renewalLimit;
  }

  if (input.gracePeriodDays !== undefined) {
    if (
      !Number.isInteger(input.gracePeriodDays) ||
      input.gracePeriodDays < 0
    ) {
      throw new Error(
        "Grace period must be a non-negative integer.",
      );
    }

    data.gracePeriodDays = input.gracePeriodDays;
  }

  const chargeFields = [
    "finePerDay",
    "lostBookCharge",
    "damagedBookCharge",
  ] as const;

  for (const field of chargeFields) {
    const value = input[field];

    if (value === undefined) {
      continue;
    }

    if (!Number.isFinite(value) || value < 0) {
      throw new Error(
        `${field} must be a non-negative number.`,
      );
    }

    data[field] = value;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("At least one setting must be provided.");
  }

  return prisma.librarySettings.upsert({
    where: {
      tenantId: input.tenantId,
    },
    update: data,
    create: {
      tenantId: input.tenantId,
      ...data,
    },
  });
}
