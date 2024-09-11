/*
  Warnings:

  - You are about to drop the column `bookCaseId` on the `AudioBook` table. All the data in the column will be lost.
  - You are about to drop the column `libraryId` on the `AudioBook` table. All the data in the column will be lost.
  - You are about to drop the column `readingListId` on the `AudioBook` table. All the data in the column will be lost.
  - You are about to drop the column `bookCaseId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `libraryId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `readingListId` on the `Book` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AudioBook" DROP CONSTRAINT "AudioBook_bookCaseId_fkey";

-- DropForeignKey
ALTER TABLE "AudioBook" DROP CONSTRAINT "AudioBook_libraryId_fkey";

-- DropForeignKey
ALTER TABLE "AudioBook" DROP CONSTRAINT "AudioBook_readingListId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_bookCaseId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_libraryId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_readingListId_fkey";

-- DropIndex
DROP INDEX "BookCase_userId_key";

-- DropIndex
DROP INDEX "Library_userId_key";

-- DropIndex
DROP INDEX "ReadingList_userId_key";

-- AlterTable
ALTER TABLE "AudioBook" DROP COLUMN "bookCaseId",
DROP COLUMN "libraryId",
DROP COLUMN "readingListId";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "bookCaseId",
DROP COLUMN "libraryId",
DROP COLUMN "readingListId";

-- CreateTable
CREATE TABLE "_LibraryBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BookCaseBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ReadingListBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LibraryAudioBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BookCaseAudioBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ReadingListAudioBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LibraryBooks_AB_unique" ON "_LibraryBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_LibraryBooks_B_index" ON "_LibraryBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookCaseBooks_AB_unique" ON "_BookCaseBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_BookCaseBooks_B_index" ON "_BookCaseBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ReadingListBooks_AB_unique" ON "_ReadingListBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadingListBooks_B_index" ON "_ReadingListBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LibraryAudioBooks_AB_unique" ON "_LibraryAudioBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_LibraryAudioBooks_B_index" ON "_LibraryAudioBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookCaseAudioBooks_AB_unique" ON "_BookCaseAudioBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_BookCaseAudioBooks_B_index" ON "_BookCaseAudioBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ReadingListAudioBooks_AB_unique" ON "_ReadingListAudioBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadingListAudioBooks_B_index" ON "_ReadingListAudioBooks"("B");

-- AddForeignKey
ALTER TABLE "_LibraryBooks" ADD CONSTRAINT "_LibraryBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryBooks" ADD CONSTRAINT "_LibraryBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCaseBooks" ADD CONSTRAINT "_BookCaseBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCaseBooks" ADD CONSTRAINT "_BookCaseBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "BookCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadingListBooks" ADD CONSTRAINT "_ReadingListBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadingListBooks" ADD CONSTRAINT "_ReadingListBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "ReadingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryAudioBooks" ADD CONSTRAINT "_LibraryAudioBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryAudioBooks" ADD CONSTRAINT "_LibraryAudioBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCaseAudioBooks" ADD CONSTRAINT "_BookCaseAudioBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCaseAudioBooks" ADD CONSTRAINT "_BookCaseAudioBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "BookCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadingListAudioBooks" ADD CONSTRAINT "_ReadingListAudioBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadingListAudioBooks" ADD CONSTRAINT "_ReadingListAudioBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "ReadingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
