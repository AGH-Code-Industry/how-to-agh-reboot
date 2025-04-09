/*
  Warnings:

  - You are about to drop the column `tour_id` on the `EventOccurrence` table. All the data in the column will be lost.
  - You are about to drop the `Tour` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[occurrence_id,event_id]` on the table `EventOccurrence` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EventOccurrence" DROP CONSTRAINT "EventOccurrence_tour_id_fkey";

-- DropForeignKey
ALTER TABLE "Tour" DROP CONSTRAINT "Tour_owner_id_fkey";

-- DropIndex
DROP INDEX "EventOccurrence_tour_id_occurrence_id_event_id_key";

-- AlterTable
ALTER TABLE "EventOccurrence" DROP COLUMN "tour_id";

-- DropTable
DROP TABLE "Tour";

-- CreateIndex
CREATE UNIQUE INDEX "EventOccurrence_occurrence_id_event_id_key" ON "EventOccurrence"("occurrence_id", "event_id");
