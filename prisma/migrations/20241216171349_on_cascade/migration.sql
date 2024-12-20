-- DropForeignKey
ALTER TABLE "AudioBookCategory" DROP CONSTRAINT "AudioBookCategory_audioBookId_fkey";

-- DropForeignKey
ALTER TABLE "AudioBookCopyright" DROP CONSTRAINT "AudioBookCopyright_audioBookId_fkey";

-- AddForeignKey
ALTER TABLE "AudioBookCopyright" ADD CONSTRAINT "AudioBookCopyright_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCategory" ADD CONSTRAINT "AudioBookCategory_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
