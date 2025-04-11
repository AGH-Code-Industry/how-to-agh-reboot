-- CreateTable
CREATE TABLE "PrizeRedeemCode" (
    "prize_redeem_code_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "prize_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrizeRedeemCode_pkey" PRIMARY KEY ("prize_redeem_code_id")
);

-- AddForeignKey
ALTER TABLE "PrizeRedeemCode" ADD CONSTRAINT "PrizeRedeemCode_prize_id_fkey" FOREIGN KEY ("prize_id") REFERENCES "Prize"("prize_id") ON DELETE RESTRICT ON UPDATE CASCADE;
