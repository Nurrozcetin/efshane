/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AudioBook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AudioBook_userId_key" ON "AudioBook"("userId");
