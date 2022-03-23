/*
  Warnings:

  - The values [other] on the enum `alcohol_types` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "alcohol_types_new" AS ENUM ('Whiskey', 'Vodka', 'Beer', 'Wine', 'Rum', 'Tequila', 'Absinthe', 'Gin', 'Other');
ALTER TABLE "users" ALTER COLUMN "alcohol" TYPE "alcohol_types_new" USING ("alcohol"::text::"alcohol_types_new");
ALTER TYPE "alcohol_types" RENAME TO "alcohol_types_old";
ALTER TYPE "alcohol_types_new" RENAME TO "alcohol_types";
DROP TYPE "alcohol_types_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "celebrations" DROP CONSTRAINT "celebrations_userId_fkey";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_userId_fkey";

-- DropForeignKey
ALTER TABLE "timeoffs" DROP CONSTRAINT "timeoffs_userId_fkey";

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeoffs" ADD CONSTRAINT "timeoffs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "celebrations" ADD CONSTRAINT "celebrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
