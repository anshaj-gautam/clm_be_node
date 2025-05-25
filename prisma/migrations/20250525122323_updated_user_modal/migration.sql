/*
  Warnings:

  - You are about to drop the column `company_email` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_company_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "company_email";
