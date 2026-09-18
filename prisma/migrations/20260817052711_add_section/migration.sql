/*
  Warnings:

  - You are about to drop the column `section` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `subjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,name,academicYear]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_classId_fkey";

-- DropIndex
DROP INDEX "classes_tenantId_name_section_academicYear_key";

-- DropIndex
DROP INDEX "subjects_classId_idx";

-- DropIndex
DROP INDEX "subjects_tenantId_classId_code_key";

-- DropIndex
DROP INDEX "subjects_tenantId_classId_name_key";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "section";

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "sectionId" TEXT;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "classId";

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sections_tenantId_idx" ON "sections"("tenantId");

-- CreateIndex
CREATE INDEX "sections_classId_idx" ON "sections"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "sections_classId_name_key" ON "sections"("classId", "name");

-- CreateIndex
CREATE INDEX "classes_tenantId_idx" ON "classes"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "classes_tenantId_name_academicYear_key" ON "classes"("tenantId", "name", "academicYear");

-- CreateIndex
CREATE INDEX "students_sectionId_idx" ON "students"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_tenantId_code_key" ON "subjects"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_tenantId_name_key" ON "subjects"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
