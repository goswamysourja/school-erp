-- CreateTable
CREATE TABLE "marks" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teachingAssignmentId" TEXT NOT NULL,
    "academicPeriodId" TEXT NOT NULL,
    "marks" DECIMAL(65,30) NOT NULL,
    "maxMarks" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marks_tenantId_idx" ON "marks"("tenantId");

-- CreateIndex
CREATE INDEX "marks_studentId_idx" ON "marks"("studentId");

-- CreateIndex
CREATE INDEX "marks_teachingAssignmentId_idx" ON "marks"("teachingAssignmentId");

-- CreateIndex
CREATE INDEX "marks_academicPeriodId_idx" ON "marks"("academicPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "marks_studentId_teachingAssignmentId_academicPeriodId_key" ON "marks"("studentId", "teachingAssignmentId", "academicPeriodId");

-- AddForeignKey
ALTER TABLE "marks" ADD CONSTRAINT "marks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marks" ADD CONSTRAINT "marks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marks" ADD CONSTRAINT "marks_teachingAssignmentId_fkey" FOREIGN KEY ("teachingAssignmentId") REFERENCES "teaching_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marks" ADD CONSTRAINT "marks_academicPeriodId_fkey" FOREIGN KEY ("academicPeriodId") REFERENCES "academic_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
