-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_email" TEXT NOT NULL,
    "company_address" TEXT NOT NULL,
    "company_phone" TEXT NOT NULL,
    "company_website" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_company_email_key" ON "User"("company_email");

-- CreateIndex
CREATE UNIQUE INDEX "User_company_website_key" ON "User"("company_website");
