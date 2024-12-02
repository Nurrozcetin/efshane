-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "publish" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "_BookCaseAudioBooks" ADD CONSTRAINT "_BookCaseAudioBooks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BookCaseAudioBooks_AB_unique";

-- AlterTable
ALTER TABLE "_BookCaseBooks" ADD CONSTRAINT "_BookCaseBooks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BookCaseBooks_AB_unique";

-- AlterTable
ALTER TABLE "_LibraryAudioBooks" ADD CONSTRAINT "_LibraryAudioBooks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_LibraryAudioBooks_AB_unique";

-- AlterTable
ALTER TABLE "_LibraryBooks" ADD CONSTRAINT "_LibraryBooks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_LibraryBooks_AB_unique";

-- AlterTable
ALTER TABLE "_ReadingListAudioBooks" ADD CONSTRAINT "_ReadingListAudioBooks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ReadingListAudioBooks_AB_unique";

-- AlterTable
ALTER TABLE "_ReadingListBooks" ADD CONSTRAINT "_ReadingListBooks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ReadingListBooks_AB_unique";
