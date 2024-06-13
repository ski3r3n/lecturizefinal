/*
  Warnings:

  - Added the required column `subject` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('MA', 'ELL', 'TP', 'HC', 'PE', 'ACC', 'LSS', 'HI', 'GE', 'ART', 'IF');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subject" "Subject" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
