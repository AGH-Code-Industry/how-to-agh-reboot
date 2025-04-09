/*
  Warnings:

  - You are about to drop the column `building_id` on the `Event` table. All the data in the column will be lost.
  - Added the required column `building_room_id` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_building_id_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "building_id",
ADD COLUMN     "building_room_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "BuildingRoom" (
    "building_room_id" SERIAL NOT NULL,
    "room" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "building_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuildingRoom_pkey" PRIMARY KEY ("building_room_id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_building_room_id_fkey" FOREIGN KEY ("building_room_id") REFERENCES "BuildingRoom"("building_room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingRoom" ADD CONSTRAINT "BuildingRoom_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Building"("building_id") ON DELETE RESTRICT ON UPDATE CASCADE;
