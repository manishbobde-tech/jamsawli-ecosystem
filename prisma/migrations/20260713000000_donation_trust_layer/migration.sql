-- Trust layer: guest donations + 80G-ready fields
ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "donorName" TEXT;
ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "donorEmail" TEXT;
ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "donorPhone" TEXT;
ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "panNumber" TEXT;
ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "want80G" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "receiptNumber" TEXT;

-- Allow guest donations (user optional)
ALTER TABLE "Donation" ALTER COLUMN "userId" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Donation_receiptNumber_key" ON "Donation"("receiptNumber");
CREATE INDEX IF NOT EXISTS "Donation_templeId_status_idx" ON "Donation"("templeId", "status");
CREATE INDEX IF NOT EXISTS "Donation_panNumber_idx" ON "Donation"("panNumber");
CREATE INDEX IF NOT EXISTS "Donation_createdAt_idx" ON "Donation"("createdAt");
