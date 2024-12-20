/*
  Warnings:

  - The primary key for the `AgeRange` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audioBookId` on the `AgeRange` table. All the data in the column will be lost.
  - The primary key for the `BookCopyright` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audioBookId` on the `BookCopyright` table. All the data in the column will be lost.
  - Made the column `bookId` on table `AgeRange` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bookId` on table `BookCopyright` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AgeRange" DROP CONSTRAINT "AgeRange_audioBookId_fkey";

-- DropForeignKey
ALTER TABLE "AgeRange" DROP CONSTRAINT "AgeRange_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookCopyright" DROP CONSTRAINT "BookCopyright_audioBookId_fkey";

-- DropForeignKey
ALTER TABLE "BookCopyright" DROP CONSTRAINT "BookCopyright_bookId_fkey";

-- AlterTable
ALTER TABLE "AgeRange" DROP CONSTRAINT "AgeRange_pkey",
DROP COLUMN "audioBookId",
ALTER COLUMN "bookId" SET NOT NULL,
ADD CONSTRAINT "AgeRange_pkey" PRIMARY KEY ("rangeId", "bookId");

-- AlterTable
ALTER TABLE "BookCopyright" DROP CONSTRAINT "BookCopyright_pkey",
DROP COLUMN "audioBookId",
ALTER COLUMN "bookId" SET NOT NULL,
ADD CONSTRAINT "BookCopyright_pkey" PRIMARY KEY ("bookId", "bookCopyrightId");

-- CreateTable
CREATE TABLE "AudioBookAgeRange" (
    "rangeId" INTEGER NOT NULL,
    "audioBookId" INTEGER NOT NULL,

    CONSTRAINT "AudioBookAgeRange_pkey" PRIMARY KEY ("rangeId","audioBookId")
);

-- CreateTable
CREATE TABLE "AudioBookCopyright" (
    "bookCopyrightId" INTEGER NOT NULL,
    "audioBookId" INTEGER NOT NULL,

    CONSTRAINT "AudioBookCopyright_pkey" PRIMARY KEY ("audioBookId","bookCopyrightId")
);

-- AddForeignKey
ALTER TABLE "AgeRange" ADD CONSTRAINT "AgeRange_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookAgeRange" ADD CONSTRAINT "AudioBookAgeRange_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookAgeRange" ADD CONSTRAINT "AudioBookAgeRange_rangeId_fkey" FOREIGN KEY ("rangeId") REFERENCES "Range"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopyright" ADD CONSTRAINT "BookCopyright_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCopyright" ADD CONSTRAINT "AudioBookCopyright_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCopyright" ADD CONSTRAINT "AudioBookCopyright_bookCopyrightId_fkey" FOREIGN KEY ("bookCopyrightId") REFERENCES "Copyright"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
