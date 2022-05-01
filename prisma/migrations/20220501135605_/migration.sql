/*
  Warnings:

  - A unique constraint covering the columns `[timeOffSourceId]` on the table `approved_time_off` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timeOffSourceId` to the `approved_time_off` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "approved_time_off" ADD COLUMN     "timeOffSourceId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "approved_time_off_timeOffSourceId_key" ON "approved_time_off"("timeOffSourceId");

-- AddForeignKey
ALTER TABLE "approved_time_off" ADD CONSTRAINT "approved_time_off_timeOffSourceId_fkey" FOREIGN KEY ("timeOffSourceId") REFERENCES "timeoffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
