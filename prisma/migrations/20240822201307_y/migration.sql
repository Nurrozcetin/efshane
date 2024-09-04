/*
  Warnings:

  - You are about to drop the column `bookCaseId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `libraryId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `BookCase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Library` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `BookCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Library` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_bookCaseId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_libraryId_fkey";

-- AlterTable
ALTER TABLE "BookCase" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bookCaseId",
DROP COLUMN "libraryId";

-- CreateIndex
CREATE UNIQUE INDEX "BookCase_userId_key" ON "BookCase"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Library_userId_key" ON "Library"("userId");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCase" ADD CONSTRAINT "BookCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
