-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_userId_fkey";

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
