-- CreateEnum
CREATE TYPE "LibraryCopyStatus" AS ENUM ('AVAILABLE', 'ISSUED', 'LOST', 'DAMAGED', 'MAINTENANCE', 'REMOVED');

-- CreateEnum
CREATE TYPE "LibraryLoanStatus" AS ENUM ('ACTIVE', 'RETURNED', 'LOST');

-- CreateTable
CREATE TABLE "library_staff_assignments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_staff_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_racks" (
    "id" TEXT NOT NULL,
    "rackNumber" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_racks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publisher" TEXT,
    "isbn" TEXT,
    "edition" TEXT,
    "publicationYear" INTEGER,
    "language" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_book_copies" (
    "id" TEXT NOT NULL,
    "accessionNumber" TEXT NOT NULL,
    "barcode" TEXT,
    "status" "LibraryCopyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DECIMAL(10,2),
    "notes" TEXT,
    "bookId" TEXT NOT NULL,
    "rackId" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_book_copies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_loans" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bookCopyId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "issuedByUserId" TEXT NOT NULL,
    "returnedByUserId" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "renewalCount" INTEGER NOT NULL DEFAULT 0,
    "status" "LibraryLoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "fineAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "finePaidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "replacementCharge" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "replacementPaidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_settings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "maxBooksPerStudent" INTEGER NOT NULL DEFAULT 3,
    "loanPeriodDays" INTEGER NOT NULL DEFAULT 14,
    "renewalLimit" INTEGER NOT NULL DEFAULT 1,
    "gracePeriodDays" INTEGER NOT NULL DEFAULT 0,
    "finePerDay" DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    "lostBookCharge" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "damagedBookCharge" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_staff_assignments_tenantId_isActive_idx" ON "library_staff_assignments"("tenantId", "isActive");

-- CreateIndex
CREATE INDEX "library_staff_assignments_teacherId_idx" ON "library_staff_assignments"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "library_staff_assignments_tenantId_teacherId_key" ON "library_staff_assignments"("tenantId", "teacherId");

-- CreateIndex
CREATE INDEX "library_categories_tenantId_isActive_idx" ON "library_categories"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "library_categories_tenantId_name_key" ON "library_categories"("tenantId", "name");

-- CreateIndex
CREATE INDEX "library_racks_tenantId_isActive_idx" ON "library_racks"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "library_racks_tenantId_rackNumber_key" ON "library_racks"("tenantId", "rackNumber");

-- CreateIndex
CREATE INDEX "library_books_tenantId_title_idx" ON "library_books"("tenantId", "title");

-- CreateIndex
CREATE INDEX "library_books_tenantId_author_idx" ON "library_books"("tenantId", "author");

-- CreateIndex
CREATE INDEX "library_books_categoryId_idx" ON "library_books"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "library_books_tenantId_isbn_key" ON "library_books"("tenantId", "isbn");

-- CreateIndex
CREATE INDEX "library_book_copies_tenantId_status_idx" ON "library_book_copies"("tenantId", "status");

-- CreateIndex
CREATE INDEX "library_book_copies_bookId_idx" ON "library_book_copies"("bookId");

-- CreateIndex
CREATE INDEX "library_book_copies_rackId_idx" ON "library_book_copies"("rackId");

-- CreateIndex
CREATE UNIQUE INDEX "library_book_copies_tenantId_accessionNumber_key" ON "library_book_copies"("tenantId", "accessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "library_book_copies_tenantId_barcode_key" ON "library_book_copies"("tenantId", "barcode");

-- CreateIndex
CREATE INDEX "library_loans_tenantId_status_idx" ON "library_loans"("tenantId", "status");

-- CreateIndex
CREATE INDEX "library_loans_tenantId_dueAt_idx" ON "library_loans"("tenantId", "dueAt");

-- CreateIndex
CREATE INDEX "library_loans_studentId_status_idx" ON "library_loans"("studentId", "status");

-- CreateIndex
CREATE INDEX "library_loans_bookCopyId_idx" ON "library_loans"("bookCopyId");

-- CreateIndex
CREATE UNIQUE INDEX "library_settings_tenantId_key" ON "library_settings"("tenantId");

-- AddForeignKey
ALTER TABLE "library_staff_assignments" ADD CONSTRAINT "library_staff_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_staff_assignments" ADD CONSTRAINT "library_staff_assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_categories" ADD CONSTRAINT "library_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_racks" ADD CONSTRAINT "library_racks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_books" ADD CONSTRAINT "library_books_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_books" ADD CONSTRAINT "library_books_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "library_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_book_copies" ADD CONSTRAINT "library_book_copies_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_book_copies" ADD CONSTRAINT "library_book_copies_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "library_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_book_copies" ADD CONSTRAINT "library_book_copies_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "library_racks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_loans" ADD CONSTRAINT "library_loans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_loans" ADD CONSTRAINT "library_loans_bookCopyId_fkey" FOREIGN KEY ("bookCopyId") REFERENCES "library_book_copies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_loans" ADD CONSTRAINT "library_loans_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_loans" ADD CONSTRAINT "library_loans_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_loans" ADD CONSTRAINT "library_loans_returnedByUserId_fkey" FOREIGN KEY ("returnedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_settings" ADD CONSTRAINT "library_settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
