/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_postId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_postId_key" ON "Analysis"("postId");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
