import { PrizeRedeemCode } from '@prisma/client';
import { prizeDOtoDTO, prizeRedeemCodeDOtoDTO, PrizeDO } from '@/types/Prize';

describe('Prize Types', () => {
  describe('prizeDOtoDTO', () => {
    it('should correctly transform Prize with no redeem codes', () => {
      const mockPrize: PrizeDO = {
        prize_id: 1,
        prize_title: 'Free Coffee',
        prize_description: 'Get a free coffee at the campus cafe',
        required_visits: 5,
        created_at: new Date(),
        updated_at: new Date(),
        redeem_codes: [],
      };

      const result = prizeDOtoDTO(mockPrize, 3);

      expect(result).toEqual({
        id: 1,
        title: 'Free Coffee',
        description: 'Get a free coffee at the campus cafe',
        requirement: 5,
        progress: 3,
        redeemed: false,
        redeemCode: undefined,
      });
    });

    it('should correctly transform Prize with unused redeem code', () => {
      const mockPrize: PrizeDO = {
        prize_id: 1,
        prize_title: 'Free Coffee',
        prize_description: 'Get a free coffee at the campus cafe',
        required_visits: 5,
        created_at: new Date(),
        updated_at: new Date(),
        redeem_codes: [
          {
            prize_redeem_code_id: 1,
            prize_id: 1,
            user_id: '1',
            code: 'COFFEE123',
            used: false,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };

      const result = prizeDOtoDTO(mockPrize, 5);

      expect(result).toEqual({
        id: 1,
        title: 'Free Coffee',
        description: 'Get a free coffee at the campus cafe',
        requirement: 5,
        progress: 5,
        redeemed: false,
        redeemCode: 'COFFEE123',
      });
    });

    it('should correctly transform Prize with used redeem code', () => {
      const mockPrize: PrizeDO = {
        prize_id: 1,
        prize_title: 'Free Coffee',
        prize_description: 'Get a free coffee at the campus cafe',
        required_visits: 5,
        created_at: new Date(),
        updated_at: new Date(),
        redeem_codes: [
          {
            prize_redeem_code_id: 1,
            prize_id: 1,
            user_id: '1',
            code: 'COFFEE123',
            used: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };

      const result = prizeDOtoDTO(mockPrize, 5);

      expect(result).toEqual({
        id: 1,
        title: 'Free Coffee',
        description: 'Get a free coffee at the campus cafe',
        requirement: 5,
        progress: 5,
        redeemed: true,
        redeemCode: 'COFFEE123',
      });
    });
  });

  describe('prizeRedeemCodeDOtoDTO', () => {
    it('should correctly transform PrizeRedeemCode', () => {
      const mockRedeemCode: PrizeRedeemCode = {
        prize_redeem_code_id: 1,
        prize_id: 1,
        user_id: '1',
        code: 'COFFEE123',
        used: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = prizeRedeemCodeDOtoDTO(mockRedeemCode);

      expect(result).toEqual({
        id: 1,
        code: 'COFFEE123',
        redeemed: false,
      });
    });
  });
});
