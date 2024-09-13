/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chapterId]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audioBookId]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[episodeId]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `audioBookId` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `episodeId` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audioBookId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `episodeId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_userId_fkey";

-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "sectionId",
ADD COLUMN     "audioBookId" INTEGER NOT NULL,
ADD COLUMN     "chapterId" INTEGER NOT NULL,
ADD COLUMN     "episodeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "sectionId",
ADD COLUMN     "audioBookId" INTEGER NOT NULL,
ADD COLUMN     "chapterId" INTEGER NOT NULL,
ADD COLUMN     "episodeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Section";

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comments_chapterId_key" ON "Comments"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Comments_audioBookId_key" ON "Comments"("audioBookId");

-- CreateIndex
CREATE UNIQUE INDEX "Comments_episodeId_key" ON "Comments"("episodeId");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
