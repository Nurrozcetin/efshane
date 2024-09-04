/*
  Warnings:

  - Added the required column `bookCaseId` to the `AudioBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libraryId` to the `AudioBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingListId` to the `AudioBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookCaseId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libraryId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingListId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookCaseId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libraryId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingListId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioBook" ADD COLUMN     "bookCaseId" INTEGER NOT NULL,
ADD COLUMN     "libraryId" INTEGER NOT NULL,
ADD COLUMN     "readingListId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "bookCaseId" INTEGER NOT NULL,
ADD COLUMN     "libraryId" INTEGER NOT NULL,
ADD COLUMN     "readingListId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bookCaseId" INTEGER NOT NULL,
ADD COLUMN     "libraryId" INTEGER NOT NULL,
ADD COLUMN     "readingListId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Library" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCase" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "BookCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingList" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ReadingList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bookCaseId_fkey" FOREIGN KEY ("bookCaseId") REFERENCES "BookCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "ReadingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_bookCaseId_fkey" FOREIGN KEY ("bookCaseId") REFERENCES "BookCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "ReadingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBook" ADD CONSTRAINT "AudioBook_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBook" ADD CONSTRAINT "AudioBook_bookCaseId_fkey" FOREIGN KEY ("bookCaseId") REFERENCES "BookCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBook" ADD CONSTRAINT "AudioBook_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "ReadingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
