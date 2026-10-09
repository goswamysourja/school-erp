/*
  Warnings:

  - Added the required column `purpose` to the `certificates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CertificatePurpose" AS ENUM ('TRANSFER', 'COMPETITION_WINNER', 'COMPETITION_PARTICIPANT', 'ACHIEVEMENT', 'PARTICIPATION');

-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "achievement" TEXT,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "eventDate" TIMESTAMP(3),
ADD COLUMN     "eventName" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "purpose" "CertificatePurpose" NOT NULL;

-- CreateIndex
CREATE INDEX "certificates_purpose_idx" ON "certificates"("purpose");
