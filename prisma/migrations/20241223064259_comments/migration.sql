/*
  Warnings:

  - A unique constraint covering the columns `[commentId]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Analysis_commentId_key" ON "Analysis"("commentId");
