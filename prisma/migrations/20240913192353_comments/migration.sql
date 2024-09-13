/*
  Warnings:

  - A unique constraint covering the columns `[bookId]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "bookId" DROP NOT NULL,
ALTER COLUMN "audioBookId" DROP NOT NULL,
ALTER COLUMN "chapterId" DROP NOT NULL,
ALTER COLUMN "episodeId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comments_bookId_key" ON "Comments"("bookId");
