-- CreateTable
CREATE TABLE "tenant_sequences" (
    "tenantId" TEXT NOT NULL,
    "sequenceKey" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tenant_sequences_pkey" PRIMARY KEY ("tenantId","sequenceKey")
);

-- AddForeignKey
ALTER TABLE "tenant_sequences" ADD CONSTRAINT "tenant_sequences_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- Initialize employee counters from existing employee IDs.
-- This prevents newly generated IDs from colliding with existing ones.

INSERT INTO "tenant_sequences"
  ("tenantId", "sequenceKey", "value")
SELECT
  "tenantId",
  'EMPLOYEE',
  COALESCE(
    MAX(
      substring("employeeId" FROM '([0-9]+)$')::integer
    ),
    0
  )
FROM "teachers"
WHERE "employeeId" ~ '[0-9]+$'
GROUP BY "tenantId"
ON CONFLICT ("tenantId", "sequenceKey")
DO UPDATE SET
  "value" = GREATEST(
    "tenant_sequences"."value",
    EXCLUDED."value"
  );