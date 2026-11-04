-- Remove the old Teacher relation and indexes.
ALTER TABLE "library_staff_assignments"
DROP CONSTRAINT "library_staff_assignments_teacherId_fkey";

DROP INDEX "library_staff_assignments_tenantId_teacherId_key";

DROP INDEX "library_staff_assignments_teacherId_idx";

-- Add the new User reference as nullable temporarily.
ALTER TABLE "library_staff_assignments"
ADD COLUMN "userId" TEXT;

-- Preserve existing assignments by mapping Teacher IDs to User IDs.
UPDATE "library_staff_assignments" AS assignment
SET "userId" = teacher."userId"
FROM "teachers" AS teacher
WHERE assignment."teacherId" = teacher."id";

-- Make the new reference mandatory.
ALTER TABLE "library_staff_assignments"
ALTER COLUMN "userId" SET NOT NULL;

-- Remove the old Teacher reference.
ALTER TABLE "library_staff_assignments"
DROP COLUMN "teacherId";

-- Create the new indexes.
CREATE UNIQUE INDEX "library_staff_assignments_tenantId_userId_key"
ON "library_staff_assignments"("tenantId", "userId");

CREATE INDEX "library_staff_assignments_userId_idx"
ON "library_staff_assignments"("userId");

-- Connect library assignments directly to Users.
ALTER TABLE "library_staff_assignments"
ADD CONSTRAINT "library_staff_assignments_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;