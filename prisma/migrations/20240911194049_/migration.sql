/*
  Warnings:

  - You are about to drop the `_AudioBookToLibrary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookToLibrary` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `BookCase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `ReadingList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_AudioBookToLibrary" DROP CONSTRAINT "_AudioBookToLibrary_A_fkey";

-- DropForeignKey
ALTER TABLE "_AudioBookToLibrary" DROP CONSTRAINT "_AudioBookToLibrary_B_fkey";

-- DropForeignKey
ALTER TABLE "_BookToLibrary" DROP CONSTRAINT "_BookToLibrary_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToLibrary" DROP CONSTRAINT "_BookToLibrary_B_fkey";

-- DropTable
DROP TABLE "_AudioBookToLibrary";

-- DropTable
DROP TABLE "_BookToLibrary";

-- CreateTable
CREATE TABLE "_LibraryBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LibraryAudioBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LibraryBooks_AB_unique" ON "_LibraryBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_LibraryBooks_B_index" ON "_LibraryBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LibraryAudioBooks_AB_unique" ON "_LibraryAudioBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_LibraryAudioBooks_B_index" ON "_LibraryAudioBooks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "BookCase_userId_key" ON "BookCase"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingList_userId_key" ON "ReadingList"("userId");

-- AddForeignKey
ALTER TABLE "_LibraryBooks" ADD CONSTRAINT "_LibraryBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryBooks" ADD CONSTRAINT "_LibraryBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryAudioBooks" ADD CONSTRAINT "_LibraryAudioBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LibraryAudioBooks" ADD CONSTRAINT "_LibraryAudioBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
