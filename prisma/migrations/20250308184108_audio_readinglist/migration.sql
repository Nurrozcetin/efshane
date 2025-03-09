/*
  Warnings:

  - The primary key for the `BookReadingList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `ListeningList` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[readingListId,bookId]` on the table `BookReadingList` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[readingListId,audioBookId]` on the table `BookReadingList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BookReadingList" DROP CONSTRAINT "BookReadingList_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookReadingList" DROP CONSTRAINT "BookReadingList_readingListId_fkey";

-- DropForeignKey
ALTER TABLE "ListeningList" DROP CONSTRAINT "ListeningList_audioBookId_fkey";

-- DropForeignKey
ALTER TABLE "ListeningList" DROP CONSTRAINT "ListeningList_userId_fkey";

-- AlterTable
ALTER TABLE "BookReadingList" DROP CONSTRAINT "BookReadingList_pkey",
ADD COLUMN     "audioBookId" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "bookId" DROP NOT NULL,
ADD CONSTRAINT "BookReadingList_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ListeningList";

-- CreateIndex
CREATE UNIQUE INDEX "BookReadingList_readingListId_bookId_key" ON "BookReadingList"("readingListId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "BookReadingList_readingListId_audioBookId_key" ON "BookReadingList"("readingListId", "audioBookId");

-- AddForeignKey
ALTER TABLE "BookReadingList" ADD CONSTRAINT "BookReadingList_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "ReadingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReadingList" ADD CONSTRAINT "BookReadingList_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReadingList" ADD CONSTRAINT "BookReadingList_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
