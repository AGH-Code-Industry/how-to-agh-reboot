-- CreateTable
CREATE TABLE "QuizResult" (
    "quiz_result_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quiz_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizResult_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz" ("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizResult_quiz_id_user_id_key" ON "QuizResult"("quiz_id", "user_id");
