/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `MessageLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('pending', 'sent', 'failed');

-- AlterTable
ALTER TABLE "MessageLog" DROP COLUMN "status",
ADD COLUMN     "status" "MessageStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastBirthdaySent" TIMESTAMP(3),
ADD COLUMN     "messageStatus" "MessageStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "MessageLog_status_scheduledTime_idx" ON "MessageLog"("status", "scheduledTime");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_messageStatus_idx" ON "User"("messageStatus");

-- CreateIndex
CREATE INDEX "User_retryCount_idx" ON "User"("retryCount");
