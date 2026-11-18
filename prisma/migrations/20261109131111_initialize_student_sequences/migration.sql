-- This is an empty migration.
INSERT INTO "tenant_sequences"
  ("tenantId", "sequenceKey", "value")
SELECT
  "tenantId",
  'STUDENT-' || substring(
    "admissionNumber" FROM '^STU-([0-9]{4})-[0-9]+$'
  ),
  MAX(
    substring(
      "admissionNumber" FROM '^STU-[0-9]{4}-([0-9]+)$'
    )::integer
  )
FROM "students"
WHERE "admissionNumber" ~ '^STU-[0-9]{4}-[0-9]+$'
GROUP BY
  "tenantId",
  substring(
    "admissionNumber" FROM '^STU-([0-9]{4})-[0-9]+$'
  )
ON CONFLICT ("tenantId", "sequenceKey")
DO UPDATE SET
  "value" = GREATEST(
    "tenant_sequences"."value",
    EXCLUDED."value"
  );