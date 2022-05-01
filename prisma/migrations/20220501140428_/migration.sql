-- DropForeignKey
ALTER TABLE "approved_time_off" DROP CONSTRAINT "approved_time_off_timeOffSourceId_fkey";

-- AddForeignKey
ALTER TABLE "approved_time_off" ADD CONSTRAINT "approved_time_off_timeOffSourceId_fkey" FOREIGN KEY ("timeOffSourceId") REFERENCES "timeoffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
