import { Prize } from '@prisma/client';

export type PrizeDO = Prize;

export type PrizeDTO = {
  id: PrizeDO['prize_id'];
  title: PrizeDO['prize_title'];
  description: PrizeDO['prize_description'];
  requirement: PrizeDO['required_visits'];
  progress: number;
};

export const prizeDOtoDTO = (data: PrizeDO, progress: number): PrizeDTO => ({
  id: data.prize_id,
  title: data.prize_title,
  description: data.prize_description,
  requirement: data.required_visits,
  progress: progress,
});
