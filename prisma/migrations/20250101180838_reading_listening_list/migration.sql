/*
  Warnings:

  - You are about to drop the `_ReadingListAudioBooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReadingListBooks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookId` to the `ReadingList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReadingList" DROP CONSTRAINT "ReadingList_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ReadingListAudioBooks" DROP CONSTRAINT "_ReadingListAudioBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReadingListAudioBooks" DROP CONSTRAINT "_ReadingListAudioBooks_B_fkey";

-- DropForeignKey
ALTER TABLE "_ReadingListBooks" DROP CONSTRAINT "_ReadingListBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReadingListBooks" DROP CONSTRAINT "_ReadingListBooks_B_fkey";

-- DropIndex
DROP INDEX "ReadingList_userId_key";

-- AlterTable
ALTER TABLE "ReadingList" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "bookId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ReadingListAudioBooks";

-- DropTable
DROP TABLE "_ReadingListBooks";

-- CreateTable
CREATE TABLE "ListeningList" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "audioBookId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListeningList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListeningList" ADD CONSTRAINT "ListeningList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListeningList" ADD CONSTRAINT "ListeningList_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
