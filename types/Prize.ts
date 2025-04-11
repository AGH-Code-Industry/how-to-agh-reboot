import { Prize, PrizeRedeemCode } from '@prisma/client';

export type PrizeDO = Prize & { redeem_codes: PrizeRedeemCode[] };

export type PrizeDTO = {
  id: PrizeDO['prize_id'];
  title: PrizeDO['prize_title'];
  description: PrizeDO['prize_description'];
  requirement: PrizeDO['required_visits'];
  progress: number;
  redeemed: boolean;
  redeemCode?: string;
};

export const prizeDOtoDTO = (data: PrizeDO, progress: number): PrizeDTO => {
  const redeemCode = data.redeem_codes.find(() => true);

  return {
    id: data.prize_id,
    title: data.prize_title,
    description: data.prize_description,
    requirement: data.required_visits,
    progress: progress,
    redeemed: redeemCode?.used ?? false,
    redeemCode: redeemCode?.code,
  };
};

export type PrizeRedeemCodeDO = PrizeRedeemCode;

export type PrizeRedeemCodeDTO = {
  id: PrizeRedeemCodeDO['prize_id'];
  code: PrizeRedeemCodeDO['code'];
  redeemed: PrizeRedeemCodeDO['used'];
};

export const prizeRedeemCodeDOtoDTO = (data: PrizeRedeemCodeDO): PrizeRedeemCodeDTO => ({
  id: data.prize_redeem_code_id,
  code: data.code,
  redeemed: data.used,
});
