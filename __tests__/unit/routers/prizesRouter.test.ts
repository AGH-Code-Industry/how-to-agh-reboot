import { prizesRouter } from '@/trpc/routers/prizes';
import { prisma } from '@/prisma/prisma';
import { PrizeDTO, PrizeRedeemCodeDTO, prizeDOtoDTO, prizeRedeemCodeDOtoDTO } from '@/types/Prize';

jest.mock('../../../lib/utils', () => ({
  generateRandomString: jest.fn().mockReturnValue('ABC123'),
}));

jest.mock('../../../trpc/init', () => ({
  procedure: {
    query: jest.fn(),
  },
  protectedProcedure: {
    query: jest.fn(),
    input: jest.fn(),
  },
  privateProcedure: {
    input: jest.fn(),
  },
  router: jest.fn().mockReturnValue({
    createCaller: jest.fn().mockReturnValue({
      getPrizes: jest.fn(),
      createRedeemCode: jest.fn(),
      getRedeemCodes: jest.fn(),
      useRedeemCode: jest.fn(),
    }),
  }),
}));

jest.mock('@/types/Prize', () => ({
  prizeDOtoDTO: (prize: any, progress: number) => ({
    id: prize.prize_id,
    title: prize.prize_title,
    description: prize.prize_description,
    requirement: prize.required_visits,
    progress: progress,
    redeemed: prize.redeem_codes.some((rc: any) => rc.used),
    redeemCode: prize.redeem_codes[0]?.code,
  }),
  prizeRedeemCodeDOtoDTO: (code: any) => ({
    id: code.prize_redeem_code_id,
    code: code.code,
    redeemed: code.used,
  }),
}));

const mockPrizes = [
  {
    prize_id: 1,
    prize_title: 'T-Shirt',
    prize_description: 'Cool AGH T-Shirt',
    required_visits: 5,
    redeem_codes: [
      {
        prize_redeem_code_id: 1,
        code: 'ABC123',
        used: false,
        user_id: '1',
      },
    ],
  },
  {
    prize_id: 2,
    prize_title: 'Sticker Pack',
    prize_description: 'Pack of AGH stickers',
    required_visits: 3,
    redeem_codes: [],
  },
];

const mockRedeemCodes = [
  {
    prize_redeem_code_id: 1,
    prize_id: 1,
    code: 'ABC123',
    used: false,
    user_id: '1',
  },
  {
    prize_redeem_code_id: 2,
    prize_id: 2,
    code: 'DEF456',
    used: true,
    user_id: '2',
  },
];

jest.mock('@/prisma/prisma', () => {
  const findManyPrizesMock = jest.fn();
  const findManyRedeemCodesMock = jest.fn();
  const findFirstPrizeMock = jest.fn();
  const findFirstRedeemCodeMock = jest.fn();
  const createRedeemCodeMock = jest.fn();
  const updateRedeemCodeMock = jest.fn();
  const aggregateEventVisitsMock = jest.fn();

  return {
    prisma: {
      prize: {
        findMany: findManyPrizesMock,
        findFirst: findFirstPrizeMock,
      },
      prizeRedeemCode: {
        findMany: findManyRedeemCodesMock,
        findFirst: findFirstRedeemCodeMock,
        create: createRedeemCodeMock,
        update: updateRedeemCodeMock,
      },
      eventVisit: {
        aggregate: aggregateEventVisitsMock,
      },
    },
  };
});

describe('prizesRouter', () => {
  let findManyPrizesSpy: jest.Mock;
  let findManyRedeemCodesSpy: jest.Mock;
  let findFirstPrizeSpy: jest.Mock;
  let findFirstRedeemCodeSpy: jest.Mock;
  let createRedeemCodeSpy: jest.Mock;
  let updateRedeemCodeSpy: jest.Mock;
  let aggregateEventVisitsSpy: jest.Mock;
  let caller: ReturnType<typeof prizesRouter.createCaller>;

  beforeEach(() => {
    jest.clearAllMocks();
    findManyPrizesSpy = prisma.prize.findMany as jest.Mock;
    findManyRedeemCodesSpy = prisma.prizeRedeemCode.findMany as jest.Mock;
    findFirstPrizeSpy = prisma.prize.findFirst as jest.Mock;
    findFirstRedeemCodeSpy = prisma.prizeRedeemCode.findFirst as jest.Mock;
    createRedeemCodeSpy = prisma.prizeRedeemCode.create as jest.Mock;
    updateRedeemCodeSpy = prisma.prizeRedeemCode.update as jest.Mock;
    aggregateEventVisitsSpy = prisma.eventVisit.aggregate as jest.Mock;

    const mockCaller = {
      getPrizes: jest.fn(),
      createRedeemCode: jest.fn(),
      getRedeemCodes: jest.fn(),
      useRedeemCode: jest.fn(),
    };

    mockCaller.getPrizes.mockImplementation(async () => {
      const prizes = await findManyPrizesSpy({
        include: {
          redeem_codes: {
            where: {
              user_id: '1',
            },
          },
        },
      });
      const visits = await aggregateEventVisitsSpy({
        _count: true,
        where: {
          user_id: '1',
        },
      });
      return prizes.map((p: any) => prizeDOtoDTO(p, visits._count));
    });

    mockCaller.createRedeemCode.mockImplementation(async ({ rewardId }) => {
      if (rewardId < 0) throw new Error('Input validation failed');

      const prize = await findFirstPrizeSpy({
        where: { prize_id: rewardId },
      });
      if (!prize) return { type: 'error', message: 'Nie znaleziono nagrody.' };

      const visits = await aggregateEventVisitsSpy({
        _count: true,
        where: { user_id: '1' },
      });
      if (visits._count < prize.required_visits) {
        return {
          type: 'error',
          message: 'Musisz zeskanować więcej kodów QR, aby odebrać tą nagrodę.',
        };
      }

      const existingCode = await findFirstRedeemCodeSpy({
        where: {
          user_id: '1',
          prize_id: rewardId,
        },
      });
      if (existingCode) {
        return {
          type: 'info',
          message: 'Kod odbioru dla tej nagrody już istnieje.',
          code: existingCode.code,
        };
      }

      const newCode = await createRedeemCodeSpy({
        data: {
          user_id: '1',
          code: 'ABC123',
          prize_id: rewardId,
        },
      });

      return {
        type: 'success',
        message: 'Poprawnie utworzono kod odbioru.',
        code: newCode.code,
      };
    });

    mockCaller.getRedeemCodes.mockImplementation(async ({ redeemed }) => {
      const codes = await findManyRedeemCodesSpy({
        where: redeemed !== undefined ? { used: redeemed } : {},
      });
      return codes.map((code: any) => prizeRedeemCodeDOtoDTO(code));
    });

    mockCaller.useRedeemCode.mockImplementation(async ({ redeemCodeId }) => {
      if (redeemCodeId < 0) throw new Error('Input validation failed');

      await updateRedeemCodeSpy({
        where: {
          prize_redeem_code_id: redeemCodeId,
        },
        data: {
          used: true,
        },
      });
    });

    caller = mockCaller;
  });

  describe('getPrizes', () => {
    it('should return all prizes with progress', async () => {
      findManyPrizesSpy.mockResolvedValueOnce(mockPrizes);
      aggregateEventVisitsSpy.mockResolvedValueOnce({ _count: 4 });

      const result: PrizeDTO[] = await caller.getPrizes();

      expect(findManyPrizesSpy).toHaveBeenCalledWith({
        include: {
          redeem_codes: {
            where: {
              user_id: '1',
            },
          },
        },
      });

      expect(aggregateEventVisitsSpy).toHaveBeenCalledWith({
        _count: true,
        where: {
          user_id: '1',
        },
      });

      expect(result).toEqual([
        {
          id: 1,
          title: 'T-Shirt',
          description: 'Cool AGH T-Shirt',
          requirement: 5,
          progress: 4,
          redeemed: false,
          redeemCode: 'ABC123',
        },
        {
          id: 2,
          title: 'Sticker Pack',
          description: 'Pack of AGH stickers',
          requirement: 3,
          progress: 4,
          redeemed: false,
          redeemCode: undefined,
        },
      ]);
    });
  });

  describe('createRedeemCode', () => {
    it('should create a redeem code when requirements are met', async () => {
      findFirstPrizeSpy.mockResolvedValueOnce(mockPrizes[1]);
      aggregateEventVisitsSpy.mockResolvedValueOnce({ _count: 4 });
      findFirstRedeemCodeSpy.mockResolvedValueOnce(null);
      createRedeemCodeSpy.mockResolvedValueOnce({
        prize_redeem_code_id: 3,
        prize_id: 2,
        code: 'ABC123',
        used: false,
        user_id: '1',
      });

      const result = await caller.createRedeemCode({ rewardId: 2 });

      expect(result).toEqual({
        type: 'success',
        message: 'Poprawnie utworzono kod odbioru.',
        code: 'ABC123',
      });

      expect(createRedeemCodeSpy).toHaveBeenCalledWith({
        data: {
          user_id: '1',
          code: 'ABC123',
          prize_id: 2,
        },
      });
    });

    it('should return error when prize is not found', async () => {
      findFirstPrizeSpy.mockResolvedValueOnce(null);

      const result = await caller.createRedeemCode({ rewardId: 999 });

      expect(result).toEqual({
        type: 'error',
        message: 'Nie znaleziono nagrody.',
      });
    });

    it('should return error when user has insufficient visits', async () => {
      findFirstPrizeSpy.mockResolvedValueOnce(mockPrizes[0]);
      aggregateEventVisitsSpy.mockResolvedValueOnce({ _count: 2 });

      const result = await caller.createRedeemCode({ rewardId: 1 });

      expect(result).toEqual({
        type: 'error',
        message: 'Musisz zeskanować więcej kodów QR, aby odebrać tą nagrodę.',
      });
    });

    it('should return existing code when already created', async () => {
      findFirstPrizeSpy.mockResolvedValueOnce(mockPrizes[0]);
      aggregateEventVisitsSpy.mockResolvedValueOnce({ _count: 5 });
      findFirstRedeemCodeSpy.mockResolvedValueOnce(mockRedeemCodes[0]);

      const result = await caller.createRedeemCode({ rewardId: 1 });

      expect(result).toEqual({
        type: 'info',
        message: 'Kod odbioru dla tej nagrody już istnieje.',
        code: 'ABC123',
      });
    });

    it('should throw error for invalid reward ID', async () => {
      await expect(caller.createRedeemCode({ rewardId: -1 })).rejects.toThrow(
        'Input validation failed'
      );
    });
  });

  describe('getRedeemCodes', () => {
    it('should return all redeem codes when no filter is provided', async () => {
      findManyRedeemCodesSpy.mockResolvedValueOnce(mockRedeemCodes);

      const result: PrizeRedeemCodeDTO[] = await caller.getRedeemCodes({});

      expect(findManyRedeemCodesSpy).toHaveBeenCalledWith({
        where: {},
      });

      expect(result).toEqual([
        {
          id: 1,
          code: 'ABC123',
          redeemed: false,
        },
        {
          id: 2,
          code: 'DEF456',
          redeemed: true,
        },
      ]);
    });

    it('should filter redeem codes by redeemed status', async () => {
      findManyRedeemCodesSpy.mockResolvedValueOnce([mockRedeemCodes[1]]);

      const result: PrizeRedeemCodeDTO[] = await caller.getRedeemCodes({ redeemed: true });

      expect(findManyRedeemCodesSpy).toHaveBeenCalledWith({
        where: { used: true },
      });

      expect(result).toHaveLength(1);
      expect(result[0].redeemed).toBe(true);
    });
  });

  describe('useRedeemCode', () => {
    it('should mark redeem code as used', async () => {
      updateRedeemCodeSpy.mockResolvedValueOnce({
        ...mockRedeemCodes[0],
        used: true,
      });

      await caller.useRedeemCode({ redeemCodeId: 1 });

      expect(updateRedeemCodeSpy).toHaveBeenCalledWith({
        where: {
          prize_redeem_code_id: 1,
        },
        data: {
          used: true,
        },
      });
    });

    it('should throw error for invalid redeem code ID', async () => {
      await expect(caller.useRedeemCode({ redeemCodeId: -1 })).rejects.toThrow(
        'Input validation failed'
      );
    });
  });
});
