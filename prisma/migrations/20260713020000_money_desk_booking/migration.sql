-- Festival capacity on sevas
ALTER TABLE "Pooja" ADD COLUMN IF NOT EXISTS "maxPerSlot" INTEGER NOT NULL DEFAULT 20;

-- Temple-grade booking fields + guest bookings
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "devoteeName" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "gotra" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "nakshatra" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "sankalp" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "phone" TEXT;

ALTER TABLE "Booking" ALTER COLUMN "userId" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "Booking_templeId_date_time_idx" ON "Booking"("templeId", "date", "time");
CREATE INDEX IF NOT EXISTS "Booking_poojaId_date_time_idx" ON "Booking"("poojaId", "date", "time");
