/*
  Warnings:

  - You are about to drop the `_LibraryAudioBooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LibraryBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LibraryAudioBooks" DROP CONSTRAINT "_LibraryAudioBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_LibraryAudioBooks" DROP CONSTRAINT "_LibraryAudioBooks_B_fkey";

-- DropForeignKey
ALTER TABLE "_LibraryBooks" DROP CONSTRAINT "_LibraryBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_LibraryBooks" DROP CONSTRAINT "_LibraryBooks_B_fkey";

-- DropTable
DROP TABLE "_LibraryAudioBooks";

-- DropTable
DROP TABLE "_LibraryBooks";

-- CreateTable
CREATE TABLE "_BookToLibrary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AudioBookToLibrary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToLibrary_AB_unique" ON "_BookToLibrary"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToLibrary_B_index" ON "_BookToLibrary"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AudioBookToLibrary_AB_unique" ON "_AudioBookToLibrary"("A", "B");

-- CreateIndex
CREATE INDEX "_AudioBookToLibrary_B_index" ON "_AudioBookToLibrary"("B");

-- AddForeignKey
ALTER TABLE "_BookToLibrary" ADD CONSTRAINT "_BookToLibrary_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToLibrary" ADD CONSTRAINT "_BookToLibrary_B_fkey" FOREIGN KEY ("B") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AudioBookToLibrary" ADD CONSTRAINT "_AudioBookToLibrary_A_fkey" FOREIGN KEY ("A") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AudioBookToLibrary" ADD CONSTRAINT "_AudioBookToLibrary_B_fkey" FOREIGN KEY ("B") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
