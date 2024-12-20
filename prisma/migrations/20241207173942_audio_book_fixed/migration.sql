/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `AudioBook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedTitle` to the `AudioBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `AudioBook` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book_summary_key";

-- AlterTable
ALTER TABLE "AudioBook" ADD COLUMN     "normalizedTitle" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AudioBook_title_key" ON "AudioBook"("title");
