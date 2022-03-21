-- CreateEnum
CREATE TYPE "tshirt_sizes" AS ENUM ('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "time_off_types" AS ENUM ('paid', 'unpaid', 'sick', 'motherhood', 'paternity');

-- CreateEnum
CREATE TYPE "occasion_types" AS ENUM ('birthday', 'nameday', 'other');

-- CreateEnum
CREATE TYPE "authority_types" AS ENUM ('Admin', 'User', 'Accounting', 'HR');

-- CreateEnum
CREATE TYPE "alcohol_types" AS ENUM ('Whiskey', 'Vodka', 'Beer', 'Wine', 'Rum', 'Tequila', 'Absinthe', 'Gin', 'other');

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "userId" UUID NOT NULL,
    "userAgent" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(80) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "authority" "authority_types" NOT NULL DEFAULT E'User',
    "alcohol" "alcohol_types",
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "phone" VARCHAR(50),
    "discord" VARCHAR(50),
    "day_of_birth" TIMESTAMPTZ(6),
    "tshirtSize" "tshirt_sizes",
    "leadId" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "userId" UUID NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeoffs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "uploaded" BOOLEAN NOT NULL DEFAULT false,
    "type" "time_off_types" NOT NULL,

    CONSTRAINT "timeoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "celebrations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "occasion" "occasion_types" NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" UUID NOT NULL,

    CONSTRAINT "celebrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_leadId_key" ON "users"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "leads_userId_key" ON "leads"("userId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeoffs" ADD CONSTRAINT "timeoffs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "celebrations" ADD CONSTRAINT "celebrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
