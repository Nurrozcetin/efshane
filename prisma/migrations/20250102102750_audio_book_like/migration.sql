-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "audioBookId" INTEGER,
ADD COLUMN     "bookId" INTEGER;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
