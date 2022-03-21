/*
  Warnings:

  - Made the column `userId` on table `leads` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_userId_fkey";

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
