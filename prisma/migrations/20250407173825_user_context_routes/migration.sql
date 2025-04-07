/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventVisit" DROP CONSTRAINT "EventVisit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestionAnswer" DROP CONSTRAINT "QuizQuestionAnswer_user_id_fkey";

-- AlterTable
ALTER TABLE "EventVisit" ALTER COLUMN "time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuizQuestionAnswer" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Prize" (
    "prize_id" SERIAL NOT NULL,
    "prize_title" TEXT NOT NULL,
    "prize_description" TEXT NOT NULL,
    "required_visits" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prize_pkey" PRIMARY KEY ("prize_id")
);
