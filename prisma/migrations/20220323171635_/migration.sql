/*
  Warnings:

  - The values [other] on the enum `occasion_types` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "occasion_types_new" AS ENUM ('birthday', 'nameday', 'Other');
ALTER TABLE "celebrations" ALTER COLUMN "occasion" TYPE "occasion_types_new" USING ("occasion"::text::"occasion_types_new");
ALTER TYPE "occasion_types" RENAME TO "occasion_types_old";
ALTER TYPE "occasion_types_new" RENAME TO "occasion_types";
DROP TYPE "occasion_types_old";
COMMIT;
