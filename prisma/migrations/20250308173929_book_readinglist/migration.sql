/*
  Warnings:

  - You are about to drop the column `bookId` on the `ReadingList` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReadingList" DROP CONSTRAINT "ReadingList_bookId_fkey";

-- AlterTable
ALTER TABLE "ReadingList" DROP COLUMN "bookId";

-- CreateTable
CREATE TABLE "BookReadingList" (
    "bookId" INTEGER NOT NULL,
    "readingListId" INTEGER NOT NULL,

    CONSTRAINT "BookReadingList_pkey" PRIMARY KEY ("bookId","readingListId")
);

-- AddForeignKey
ALTER TABLE "BookReadingList" ADD CONSTRAINT "BookReadingList_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReadingList" ADD CONSTRAINT "BookReadingList_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "ReadingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
