/*
  Warnings:

  - You are about to drop the column `articleId` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `AudioBook` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `AudioBook` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `Hashtags` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `ReadingProgress` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dictionary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Speech` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `page` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PrivateNotes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progress` to the `ReadingProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "Hashtags" DROP CONSTRAINT "Hashtags_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Speech" DROP CONSTRAINT "Speech_dictId_fkey";

-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "articleId";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AudioBook" DROP COLUMN "date",
DROP COLUMN "images",
ADD COLUMN     "publish_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "date",
ADD COLUMN     "page" INTEGER NOT NULL,
ADD COLUMN     "publish_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "date",
ADD COLUMN     "publish_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Hashtags" DROP COLUMN "articleId";

-- AlterTable
ALTER TABLE "PrivateNotes" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReadingProgress" DROP COLUMN "date",
ADD COLUMN     "progress" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "profile_image" TEXT NOT NULL;

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "Dictionary";

-- DropTable
DROP TABLE "Speech";

-- AddForeignKey
ALTER TABLE "PrivateNotes" ADD CONSTRAINT "PrivateNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
