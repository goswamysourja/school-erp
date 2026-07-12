/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,classId,name]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subjects_tenantId_classId_name_key" ON "subjects"("tenantId", "classId", "name");
