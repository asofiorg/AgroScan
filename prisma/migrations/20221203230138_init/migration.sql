/*
  Warnings:

  - Changed the type of `lat` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lng` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "lat",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
DROP COLUMN "lng",
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
