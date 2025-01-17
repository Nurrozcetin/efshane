/*
  Warnings:

  - You are about to drop the `Library` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LibraryAudioBooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LibraryBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Library" DROP CONSTRAINT "Library_userId_fkey";

-- DropForeignKey
ALTER TABLE "_LibraryAudioBooks" DROP CONSTRAINT "_LibraryAudioBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_LibraryAudioBooks" DROP CONSTRAINT "_LibraryAudioBooks_B_fkey";

-- DropForeignKey
ALTER TABLE "_LibraryBooks" DROP CONSTRAINT "_LibraryBooks_A_fkey";

-- DropForeignKey
ALTER TABLE "_LibraryBooks" DROP CONSTRAINT "_LibraryBooks_B_fkey";

-- DropTable
DROP TABLE "Library";

-- DropTable
DROP TABLE "_LibraryAudioBooks";

-- DropTable
DROP TABLE "_LibraryBooks";
