/*
  Warnings:

  - Added the required column `userReg_no` to the `CourseRegistrations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_courseRegistrationsId_fkey";

-- AlterTable
ALTER TABLE "CourseRegistrations" ADD COLUMN     "userReg_no" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CourseRegistrations" ADD CONSTRAINT "CourseRegistrations_userReg_no_fkey" FOREIGN KEY ("userReg_no") REFERENCES "User"("reg_no") ON DELETE RESTRICT ON UPDATE CASCADE;
