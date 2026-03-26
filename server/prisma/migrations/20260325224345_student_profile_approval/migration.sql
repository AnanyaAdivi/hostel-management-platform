/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentNo]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "approvalStatus" "public"."ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "careerGoal" TEXT,
ADD COLUMN     "course" TEXT,
ADD COLUMN     "enrollmentNo" TEXT,
ADD COLUMN     "gender" "public"."Gender",
ADD COLUMN     "parentContactNo" TEXT,
ADD COLUMN     "sportsInterests" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "users_enrollmentNo_key" ON "public"."users"("enrollmentNo");
