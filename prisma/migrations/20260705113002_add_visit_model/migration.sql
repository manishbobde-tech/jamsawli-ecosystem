-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkOutTime" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "templeId" TEXT,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON UPDATE CASCADE ON DELETE SET NULL;