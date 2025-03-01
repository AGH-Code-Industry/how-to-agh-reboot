/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Event" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "should_be_displayed" BOOLEAN NOT NULL,
    "location_longitude" REAL NOT NULL,
    "location_latitude" REAL NOT NULL,
    "event_type_id" INTEGER NOT NULL,
    "building_id" INTEGER NOT NULL,
    "qr_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Event_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "EventType" ("event_type_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Building" ("building_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_qr_id_fkey" FOREIGN KEY ("qr_id") REFERENCES "QR" ("qr_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner" ("owner_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventType" (
    "event_type_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BuildingEntry" (
    "building_entry_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "map_longitude" REAL NOT NULL,
    "map_latitude" REAL NOT NULL,
    "building_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "BuildingEntry_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Building" ("building_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Building" (
    "building_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QR" (
    "qr_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Owner" (
    "owner_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EventTheme" (
    "event_theme_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "EventTheme_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "Theme" ("theme_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventTheme_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Theme" (
    "theme_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EventFieldOfStudy" (
    "event_field_of_study_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "field_of_study_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "EventFieldOfStudy_field_of_study_id_fkey" FOREIGN KEY ("field_of_study_id") REFERENCES "FieldOfStudy" ("field_of_study_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventFieldOfStudy_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FieldOfStudy" (
    "field_of_study_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "faculty_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "FieldOfStudy_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty" ("faculty_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Faculty" (
    "faculty_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tour" (
    "tour_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "owner_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Tour_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner" ("owner_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Occurrence" (
    "occurrence_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EventOccurrence" (
    "event_occurrence_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tour_id" INTEGER NOT NULL,
    "occurrence_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "EventOccurrence_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "Tour" ("tour_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventOccurrence_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "Occurrence" ("occurrence_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventOccurrence_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventVisit" (
    "event_visit_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "EventVisit_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventVisit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionType" (
    "question_type_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "question_type_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Question_question_type_id_fkey" FOREIGN KEY ("question_type_id") REFERENCES "QuestionType" ("question_type_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "answer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "question_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question" ("question_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Quiz" (
    "quiz_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quiz_question_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "QuizQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question" ("question_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestion_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz" ("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizQuestionAnswer" (
    "quiz_question_answer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "correct_answer" INTEGER NOT NULL,
    "quiz_question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "QuizQuestionAnswer_quiz_question_id_fkey" FOREIGN KEY ("quiz_question_id") REFERENCES "QuizQuestion" ("quiz_question_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestionAnswer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("name") SELECT "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "EventTheme_theme_id_event_id_key" ON "EventTheme"("theme_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventFieldOfStudy_field_of_study_id_event_id_key" ON "EventFieldOfStudy"("field_of_study_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventOccurrence_tour_id_occurrence_id_event_id_key" ON "EventOccurrence"("tour_id", "occurrence_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventVisit_event_id_user_id_key" ON "EventVisit"("event_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_question_id_quiz_id_key" ON "QuizQuestion"("question_id", "quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestionAnswer_quiz_question_id_user_id_key" ON "QuizQuestionAnswer"("quiz_question_id", "user_id");
