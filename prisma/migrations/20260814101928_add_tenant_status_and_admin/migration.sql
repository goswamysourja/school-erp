/*
  Tenant lifecycle migration

  Existing data:
    isActive = true  -> ACTIVE
    isActive = false -> INACTIVE
*/

-- Create the new enum
CREATE TYPE "TenantStatus" AS ENUM (
  'PENDING',
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'REJECTED'
);

-- Add the new columns.
-- status is temporarily nullable so existing rows can be migrated safely.
ALTER TABLE "tenants"
ADD COLUMN "status" "TenantStatus",
ADD COLUMN "adminUserId" TEXT;

-- Preserve existing tenant lifecycle state.
UPDATE "tenants"
SET "status" =
  CASE
    WHEN "isActive" = true
      THEN 'ACTIVE'::"TenantStatus"
    ELSE 'INACTIVE'::"TenantStatus"
  END;

-- status is now guaranteed to exist for every tenant.
ALTER TABLE "tenants"
ALTER COLUMN "status" SET NOT NULL;

-- New tenants default to PENDING.
ALTER TABLE "tenants"
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- The old lifecycle field is no longer needed.
ALTER TABLE "tenants"
DROP COLUMN "isActive";

-- Each tenant can have at most one administrator.
-- NULL values are allowed, so existing tenants do not need an
-- administrator immediately.
CREATE UNIQUE INDEX "tenants_adminUserId_key"
ON "tenants"("adminUserId");

-- Connect Tenant.adminUserId -> User.id.
ALTER TABLE "tenants"
ADD CONSTRAINT "tenants_adminUserId_fkey"
FOREIGN KEY ("adminUserId")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;