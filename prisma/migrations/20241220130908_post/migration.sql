/*
  Warnings:

  - You are about to drop the `PrivateNotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `repost_count` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrivateNotes" DROP CONSTRAINT "PrivateNotes_bookId_fkey";

-- DropForeignKey
ALTER TABLE "PrivateNotes" DROP CONSTRAINT "PrivateNotes_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingProgress" DROP CONSTRAINT "ReadingProgress_bookId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingProgress" DROP CONSTRAINT "ReadingProgress_userId_fkey";

-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "postId" INTEGER,
ADD COLUMN     "repost_count" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PrivateNotes";

-- DropTable
DROP TABLE "ReadingProgress";

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
