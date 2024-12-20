-- DropForeignKey
ALTER TABLE "AgeRange" DROP CONSTRAINT "AgeRange_bookId_fkey";

-- DropForeignKey
ALTER TABLE "AgeRange" DROP CONSTRAINT "AgeRange_rangeId_fkey";

-- DropForeignKey
ALTER TABLE "AudioBookAgeRange" DROP CONSTRAINT "AudioBookAgeRange_audioBookId_fkey";

-- DropForeignKey
ALTER TABLE "AudioBookAgeRange" DROP CONSTRAINT "AudioBookAgeRange_rangeId_fkey";

-- DropForeignKey
ALTER TABLE "AudioBookHashtags" DROP CONSTRAINT "AudioBookHashtags_audioBookId_fkey";

-- DropForeignKey
ALTER TABLE "BookCategory" DROP CONSTRAINT "BookCategory_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookCopyright" DROP CONSTRAINT "BookCopyright_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookHashtags" DROP CONSTRAINT "BookHashtags_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookHashtags" ADD CONSTRAINT "BookHashtags_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookHashtags" ADD CONSTRAINT "AudioBookHashtags_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgeRange" ADD CONSTRAINT "AgeRange_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgeRange" ADD CONSTRAINT "AgeRange_rangeId_fkey" FOREIGN KEY ("rangeId") REFERENCES "Range"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookAgeRange" ADD CONSTRAINT "AudioBookAgeRange_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookAgeRange" ADD CONSTRAINT "AudioBookAgeRange_rangeId_fkey" FOREIGN KEY ("rangeId") REFERENCES "Range"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopyright" ADD CONSTRAINT "BookCopyright_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
