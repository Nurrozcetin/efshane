/*
  Warnings:

  - You are about to drop the column `audioBookId` on the `Hashtags` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Hashtags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hashtags" DROP CONSTRAINT "Hashtags_audioBookId_fkey";

-- DropForeignKey
ALTER TABLE "Hashtags" DROP CONSTRAINT "Hashtags_bookId_fkey";

-- AlterTable
ALTER TABLE "Hashtags" DROP COLUMN "audioBookId",
DROP COLUMN "bookId",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BookHashtags" (
    "bookId" INTEGER NOT NULL,
    "hashtagsId" INTEGER NOT NULL,

    CONSTRAINT "BookHashtags_pkey" PRIMARY KEY ("bookId","hashtagsId")
);

-- CreateTable
CREATE TABLE "AudioBookHashtags" (
    "audioBookId" INTEGER NOT NULL,
    "hashtagsId" INTEGER NOT NULL,

    CONSTRAINT "AudioBookHashtags_pkey" PRIMARY KEY ("audioBookId","hashtagsId")
);

-- AddForeignKey
ALTER TABLE "BookHashtags" ADD CONSTRAINT "BookHashtags_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookHashtags" ADD CONSTRAINT "BookHashtags_hashtagsId_fkey" FOREIGN KEY ("hashtagsId") REFERENCES "Hashtags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookHashtags" ADD CONSTRAINT "AudioBookHashtags_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookHashtags" ADD CONSTRAINT "AudioBookHashtags_hashtagsId_fkey" FOREIGN KEY ("hashtagsId") REFERENCES "Hashtags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
