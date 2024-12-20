/*
  Warnings:

  - The primary key for the `AgeRange` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookCopyright` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AgeRange" DROP CONSTRAINT "AgeRange_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookCopyright" DROP CONSTRAINT "BookCopyright_bookId_fkey";

-- AlterTable
ALTER TABLE "AgeRange" DROP CONSTRAINT "AgeRange_pkey",
ADD COLUMN     "audioBookId" INTEGER,
ALTER COLUMN "bookId" DROP NOT NULL,
ADD CONSTRAINT "AgeRange_pkey" PRIMARY KEY ("rangeId");

-- AlterTable
ALTER TABLE "BookCopyright" DROP CONSTRAINT "BookCopyright_pkey",
ADD COLUMN     "audioBookId" INTEGER,
ALTER COLUMN "bookId" DROP NOT NULL,
ADD CONSTRAINT "BookCopyright_pkey" PRIMARY KEY ("bookCopyrightId");

-- AddForeignKey
ALTER TABLE "AgeRange" ADD CONSTRAINT "AgeRange_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgeRange" ADD CONSTRAINT "AgeRange_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopyright" ADD CONSTRAINT "BookCopyright_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopyright" ADD CONSTRAINT "BookCopyright_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
