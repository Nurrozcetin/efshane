/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.
  - Made the column `postId` on table `Analysis` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Analysis" ALTER COLUMN "postId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_postId_key" ON "Analysis"("postId");
