/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,name,section,academicYear]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "classes_tenantId_name_section_academicYear_key" ON "classes"("tenantId", "name", "section", "academicYear");
