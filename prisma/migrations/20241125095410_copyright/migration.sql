-- CreateTable
CREATE TABLE "Range" (
    "id" SERIAL NOT NULL,
    "range" TEXT NOT NULL,

    CONSTRAINT "Range_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgeRange" (
    "rangeId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "AgeRange_pkey" PRIMARY KEY ("bookId","rangeId")
);

-- CreateTable
CREATE TABLE "Copyright" (
    "id" SERIAL NOT NULL,
    "copyright" TEXT NOT NULL,

    CONSTRAINT "Copyright_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCopyright" (
    "bookCopyrightId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "BookCopyright_pkey" PRIMARY KEY ("bookId","bookCopyrightId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Range_range_key" ON "Range"("range");

-- AddForeignKey
ALTER TABLE "AgeRange" ADD CONSTRAINT "AgeRange_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgeRange" ADD CONSTRAINT "AgeRange_rangeId_fkey" FOREIGN KEY ("rangeId") REFERENCES "Range"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopyright" ADD CONSTRAINT "BookCopyright_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopyright" ADD CONSTRAINT "BookCopyright_bookCopyrightId_fkey" FOREIGN KEY ("bookCopyrightId") REFERENCES "Copyright"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
