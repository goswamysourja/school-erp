WITH existing_copy_ids AS (
  SELECT
    "tenantId",
    substring("accessionNumber" FROM '^COPY-([0-9]+)$') AS suffix
  FROM "library_book_copies"
  WHERE "accessionNumber" ~ '^COPY-[0-9]+$'

  UNION ALL

  SELECT
    "tenantId",
    substring("barcode" FROM '^COPY-([0-9]+)$') AS suffix
  FROM "library_book_copies"
  WHERE "barcode" ~ '^COPY-[0-9]+$'
)
INSERT INTO "tenant_sequences"
  ("tenantId", "sequenceKey", "value")
SELECT
  "tenantId",
  'LIBRARY_COPY',
  MAX(suffix::integer)
FROM existing_copy_ids
GROUP BY "tenantId"
ON CONFLICT ("tenantId", "sequenceKey")
DO UPDATE SET
  "value" = GREATEST(
    "tenant_sequences"."value",
    EXCLUDED."value"
  );