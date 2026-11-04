-- CreateEnum
CREATE TYPE "StaffDesignation" AS ENUM ('TEACHER', 'LIBRARIAN', 'ACCOUNTANT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "designation" "StaffDesignation";

UPDATE "users"
SET "designation" = 'TEACHER'
WHERE "role" = 'TEACHER';