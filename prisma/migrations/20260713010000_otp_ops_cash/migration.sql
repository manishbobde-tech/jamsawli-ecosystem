-- Phone OTP
CREATE TABLE IF NOT EXISTS "PhoneOtp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PhoneOtp_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PhoneOtp_phone_consumed_idx" ON "PhoneOtp"("phone", "consumed");
CREATE INDEX IF NOT EXISTS "PhoneOtp_expiresAt_idx" ON "PhoneOtp"("expiresAt");

-- Cash / hundi entries
CREATE TABLE IF NOT EXISTS "CashEntry" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'HUNDI',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "note" TEXT,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templeId" TEXT NOT NULL,
    "recordedById" TEXT,
    CONSTRAINT "CashEntry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CashEntry_templeId_collectedAt_idx" ON "CashEntry"("templeId", "collectedAt");
CREATE INDEX IF NOT EXISTS "CashEntry_type_idx" ON "CashEntry"("type");

ALTER TABLE "CashEntry" DROP CONSTRAINT IF EXISTS "CashEntry_templeId_fkey";
ALTER TABLE "CashEntry" ADD CONSTRAINT "CashEntry_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CashEntry" DROP CONSTRAINT IF EXISTS "CashEntry_recordedById_fkey";
ALTER TABLE "CashEntry" ADD CONSTRAINT "CashEntry_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Ops checklist
CREATE TABLE IF NOT EXISTS "OpsChecklistLog" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "items" JSONB NOT NULL,
    "notes" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templeId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "OpsChecklistLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "OpsChecklistLog_templeId_date_key" ON "OpsChecklistLog"("templeId", "date");
CREATE INDEX IF NOT EXISTS "OpsChecklistLog_templeId_idx" ON "OpsChecklistLog"("templeId");

ALTER TABLE "OpsChecklistLog" DROP CONSTRAINT IF EXISTS "OpsChecklistLog_templeId_fkey";
ALTER TABLE "OpsChecklistLog" ADD CONSTRAINT "OpsChecklistLog_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OpsChecklistLog" DROP CONSTRAINT IF EXISTS "OpsChecklistLog_userId_fkey";
ALTER TABLE "OpsChecklistLog" ADD CONSTRAINT "OpsChecklistLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
