/*
  Warnings:

  - You are about to drop the column `content` on the `Episodes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Episodes" DROP COLUMN "content",
ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "textFile" TEXT,
ALTER COLUMN "image" DROP NOT NULL;
