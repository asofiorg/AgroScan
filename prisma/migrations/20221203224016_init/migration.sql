-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "lat" TEXT NOT NULL,
    "lng" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" INTEGER NOT NULL,
    "comments" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
