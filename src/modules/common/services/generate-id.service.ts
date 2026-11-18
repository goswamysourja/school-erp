import { Prisma } from "@prisma/client";

interface GenerateTenantIdInput {
  tenantId: string;
  sequenceKey: string;
  prefix: string;
  padding?: number;
}

/**
 * Generates a unique, sequential business ID for a tenant.
 *
 * Must be called inside a Prisma transaction.
 *
 * Example:
 * EMP-000001
 * EMP-000002
 */
export async function generateTenantId(
  tx: Prisma.TransactionClient,
  input: GenerateTenantIdInput,
): Promise<string> {
  const {
    tenantId,
    sequenceKey,
    prefix,
    padding = 6,
  } = input;

  if (!tenantId.trim()) {
    throw new Error("Tenant ID is required.");
  }

  if (!sequenceKey.trim()) {
    throw new Error("Sequence key is required.");
  }

  if (!prefix.trim()) {
    throw new Error("ID prefix is required.");
  }

  if (!Number.isInteger(padding) || padding < 1 || padding > 12) {
    throw new Error("Invalid ID padding.");
  }

  const sequences = await tx.$queryRaw<
    { value: number }[]
  >`
    INSERT INTO "tenant_sequences" (
      "tenantId",
      "sequenceKey",
      "value"
    )
    VALUES (
      ${tenantId},
      ${sequenceKey},
      1
    )
    ON CONFLICT ("tenantId", "sequenceKey")
    DO UPDATE SET
      "value" = "tenant_sequences"."value" + 1
    RETURNING "value"
  `;

  const sequence = sequences[0];

  if (!sequence) {
    throw new Error("Failed to generate business ID.");
  }

  return `${prefix}-${String(sequence.value).padStart(
    padding,
    "0",
  )}`;
}