-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "domain" TEXT,
ADD COLUMN     "hostingExpiresAt" TIMESTAMP(3),
ADD COLUMN     "hostingPlan" TEXT,
ADD COLUMN     "ssl" BOOLEAN NOT NULL DEFAULT false;
