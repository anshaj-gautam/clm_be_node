/*
  Warnings:

  - A unique constraint covering the columns `[company_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_address]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_company_name_key" ON "User"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_company_address_key" ON "User"("company_address");

-- CreateIndex
CREATE UNIQUE INDEX "User_company_phone_key" ON "User"("company_phone");
