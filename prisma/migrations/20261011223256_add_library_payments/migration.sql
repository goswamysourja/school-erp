-- CreateEnum
CREATE TYPE "LibraryPaymentType" AS ENUM ('FINE', 'REPLACEMENT');

-- CreateEnum
CREATE TYPE "LibraryPaymentMethod" AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'OTHER');

-- CreateTable
CREATE TABLE "library_payments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "receivedByUserId" TEXT NOT NULL,
    "type" "LibraryPaymentType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "LibraryPaymentMethod" NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_payments_tenantId_receivedAt_idx" ON "library_payments"("tenantId", "receivedAt");

-- CreateIndex
CREATE INDEX "library_payments_loanId_type_idx" ON "library_payments"("loanId", "type");

-- CreateIndex
CREATE INDEX "library_payments_receivedByUserId_idx" ON "library_payments"("receivedByUserId");

-- AddForeignKey
ALTER TABLE "library_payments" ADD CONSTRAINT "library_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_payments" ADD CONSTRAINT "library_payments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "library_loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_payments" ADD CONSTRAINT "library_payments_receivedByUserId_fkey" FOREIGN KEY ("receivedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
