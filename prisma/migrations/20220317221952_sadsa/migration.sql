-- CreateEnum
CREATE TYPE "tshirt_sizes" AS ENUM ('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL');

-- CreateEnum
CREATE TYPE "time_off_types" AS ENUM ('paid', 'unpaid', 'sick', 'motherhood', 'paternity');

-- CreateEnum
CREATE TYPE "occasion_types" AS ENUM ('birthday', 'nameday', 'other');

-- CreateEnum
CREATE TYPE "authority_types" AS ENUM ('Admin', 'User', 'Accounting', 'HR');

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
    "password" VARCHAR(15) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "authority" "authority_types" NOT NULL DEFAULT E'User',
    "teamId" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "phone" VARCHAR(50),
    "discord" VARCHAR(50),
    "day_of_birth" TIMESTAMPTZ(6),
    "tshirtSize" "tshirt_sizes",

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "celebrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_teamId_key" ON "users"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_lead_id_key" ON "teams"("lead_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeoffs" ADD CONSTRAINT "timeoffs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
