/*
  Warnings:

  - The values [FrontEnd,BackEnd,Manager] on the enum `authority_types` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PositionTypes" AS ENUM ('Developer', 'HR', 'Accountant', 'Manager');

-- AlterEnum
BEGIN;
CREATE TYPE "authority_types_new" AS ENUM ('Admin', 'User', 'Accounting', 'HR');
ALTER TABLE "users" ALTER COLUMN "authority" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "authority" TYPE "authority_types_new" USING ("authority"::text::"authority_types_new");
ALTER TABLE "users" ALTER COLUMN "roles" TYPE "authority_types_new"[] USING ("roles"::text::"authority_types_new"[]);
ALTER TYPE "authority_types" RENAME TO "authority_types_old";
ALTER TYPE "authority_types_new" RENAME TO "authority_types";
DROP TYPE "authority_types_old";
ALTER TABLE "users" ALTER COLUMN "authority" SET DEFAULT 'User';
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "position" "PositionTypes" NOT NULL DEFAULT E'Developer';
