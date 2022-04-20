-- DropIndex
DROP INDEX "celebrations_start_date_idx";

-- CreateTable
CREATE TABLE "approved_time_off" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "dates" TEXT[],
    "holderId" UUID NOT NULL,

    CONSTRAINT "approved_time_off_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approved_time_offs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "approved_time_offs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "approved_time_off" ADD CONSTRAINT "approved_time_off_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "approved_time_offs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
