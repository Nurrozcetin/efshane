-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "sectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "date_of_birth" DROP DEFAULT;
