/*
  Warnings:

  - You are about to drop the column `episodes` on the `AudioBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AudioBook" DROP COLUMN "episodes";

-- CreateTable
CREATE TABLE "Episodes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "publish_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audioFile" TEXT NOT NULL,
    "audiobookId" INTEGER,
    "sectionId" INTEGER,

    CONSTRAINT "Episodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Episodes" ADD CONSTRAINT "Episodes_audiobookId_fkey" FOREIGN KEY ("audiobookId") REFERENCES "AudioBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episodes" ADD CONSTRAINT "Episodes_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
