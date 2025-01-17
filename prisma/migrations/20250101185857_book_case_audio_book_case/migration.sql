/*
  Warnings:

  - You are about to drop the `_BookCaseAudioBooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookCaseBooks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookId` to the `BookCase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BookCaseAudioBooks" DROP CONSTRAINT "_BookCaseAudioBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookCaseAudioBooks" DROP CONSTRAINT "_BookCaseAudioBooks_B_fkey";

-- DropForeignKey
ALTER TABLE "_BookCaseBooks" DROP CONSTRAINT "_BookCaseBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookCaseBooks" DROP CONSTRAINT "_BookCaseBooks_B_fkey";

-- DropIndex
DROP INDEX "BookCase_userId_key";

-- AlterTable
ALTER TABLE "BookCase" ADD COLUMN     "bookId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_BookCaseAudioBooks";

-- DropTable
DROP TABLE "_BookCaseBooks";

-- CreateTable
CREATE TABLE "AudioBookCase" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "audioBookId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBookCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookCase" ADD CONSTRAINT "BookCase_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCase" ADD CONSTRAINT "AudioBookCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCase" ADD CONSTRAINT "AudioBookCase_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
