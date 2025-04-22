import { qrRouter } from '@/trpc/routers/qr';
import { prisma } from '@/prisma/prisma';

jest.mock('../../../trpc/init', () => {
  const mockProcedure = {
    input: jest.fn().mockImplementation((schema) => ({
      mutation: jest.fn().mockImplementation((handler) => ({
        mutation: async (input: any) => {
          try {
            schema.parse(input);
            const ctx = {
              input,
              user: {
                id: '1',
                email: 'test@example.com',
                isAnonymous: false,
              },
            };
            return handler({ input, ctx });
          } catch (error) {
            throw new Error('Input validation failed');
          }
        },
        _def: {
          mutation: handler,
        },
      })),
    })),
    query: jest.fn().mockImplementation((handler) => ({
      query: async () => {
        const ctx = {
          user: {
            id: '1',
            email: 'test@example.com',
            isAnonymous: false,
          },
        };
        return handler({ ctx });
      },
      _def: {
        query: handler,
      },
    })),
  };

  return {
    procedure: mockProcedure,
    protectedProcedure: mockProcedure,
    router: jest.fn().mockImplementation((routes) => ({
      createCaller: jest.fn().mockImplementation(() => ({
        submitQr: async (input: string) => routes.submitQr.mutation(input),
        getScannedAmount: async () => routes.getScannedAmount.query(),
      })),
    })),
  };
});

const mockQr = {
  qr_id: 1,
  code: 'test-qr-code',
};

const mockEvent = {
  event_id: 1,
  qr_id: 1,
  name: 'Test Event',
};

jest.mock('@/prisma/prisma', () => {
  const findFirstQRMock = jest.fn();
  const findFirstEventMock = jest.fn();
  const findFirstEventVisitMock = jest.fn();
  const createEventVisitMock = jest.fn();
  const aggregateEventVisitMock = jest.fn();

  return {
    prisma: {
      qR: {
        findFirst: findFirstQRMock,
      },
      event: {
        findFirst: findFirstEventMock,
      },
      eventVisit: {
        findFirst: findFirstEventVisitMock,
        create: createEventVisitMock,
        aggregate: aggregateEventVisitMock,
      },
    },
  };
});

describe('qrRouter', () => {
  let findFirstQRSpy: jest.Mock;
  let findFirstEventSpy: jest.Mock;
  let findFirstEventVisitSpy: jest.Mock;
  let createEventVisitSpy: jest.Mock;
  let aggregateEventVisitSpy: jest.Mock;
  let caller: ReturnType<typeof qrRouter.createCaller>;

  beforeEach(() => {
    jest.clearAllMocks();
    findFirstQRSpy = prisma.qR.findFirst as jest.Mock;
    findFirstEventSpy = prisma.event.findFirst as jest.Mock;
    findFirstEventVisitSpy = prisma.eventVisit.findFirst as jest.Mock;
    createEventVisitSpy = prisma.eventVisit.create as jest.Mock;
    aggregateEventVisitSpy = prisma.eventVisit.aggregate as jest.Mock;
    caller = qrRouter.createCaller({
      auth: true,
      user: {
        id: '1',
        email: 'test@example.com',
        isAnonymous: false,
      },
    });
  });

  describe('submitQr', () => {
    it('should return error for unknown QR code', async () => {
      findFirstQRSpy.mockResolvedValueOnce(null);

      const result = await caller.submitQr('unknown-qr-code');

      expect(findFirstQRSpy).toHaveBeenCalledWith({
        where: {
          code: {
            equals: 'unknown-qr-code',
          },
        },
      });
      expect(result).toEqual({
        type: 'error',
        message: 'Nieznany kod QR',
      });
    });

    it('should return error when QR code has no associated event', async () => {
      findFirstQRSpy.mockResolvedValueOnce(mockQr);
      findFirstEventSpy.mockResolvedValueOnce(null);

      const result = await caller.submitQr('test-qr-code');

      expect(findFirstEventSpy).toHaveBeenCalledWith({
        where: {
          qr_id: {
            equals: mockQr.qr_id,
          },
        },
      });
      expect(result).toEqual({
        type: 'error',
        message: 'Nieznany kod QR',
      });
    });

    it('should return info when QR code was already scanned', async () => {
      findFirstQRSpy.mockResolvedValueOnce(mockQr);
      findFirstEventSpy.mockResolvedValueOnce(mockEvent);
      findFirstEventVisitSpy.mockResolvedValueOnce({
        event_visit_id: 1,
        user_id: '1',
        event_id: 1,
      });

      const result = await caller.submitQr('test-qr-code');

      expect(findFirstEventVisitSpy).toHaveBeenCalledWith({
        where: {
          event_id: {
            equals: mockEvent.event_id,
          },
          user_id: {
            equals: '1',
          },
        },
      });
      expect(result).toEqual({
        type: 'info',
        message: 'Ten kod został już wcześniej zeskanowany',
      });
    });

    it('should successfully register new QR code scan', async () => {
      findFirstQRSpy.mockResolvedValueOnce(mockQr);
      findFirstEventSpy.mockResolvedValueOnce(mockEvent);
      findFirstEventVisitSpy.mockResolvedValueOnce(null);
      createEventVisitSpy.mockResolvedValueOnce({
        event_visit_id: 1,
        user_id: '1',
        event_id: 1,
      });

      const result = await caller.submitQr('test-qr-code');

      expect(createEventVisitSpy).toHaveBeenCalledWith({
        data: {
          user_id: '1',
          event_id: mockEvent.event_id,
        },
      });
      expect(result).toEqual({
        type: 'success',
        message: 'Kod pomyślnie zeskanowany',
        eventId: mockEvent.event_id,
      });
    });

    it('should throw error for invalid QR code format', async () => {
      findFirstQRSpy.mockImplementationOnce(() => {
        throw new Error('Input validation failed');
      });

      await expect(caller.submitQr('')).rejects.toThrow('Input validation failed');
    });
  });

  describe('getScannedAmount', () => {
    it('should return the number of scanned QR codes', async () => {
      aggregateEventVisitSpy.mockResolvedValueOnce({
        _count: {
          event_visit_id: 5,
        },
      });

      const result = await caller.getScannedAmount();

      expect(aggregateEventVisitSpy).toHaveBeenCalledWith({
        where: {
          user_id: {
            equals: '1',
          },
        },
        _count: {
          event_visit_id: true,
        },
      });
      expect(result).toEqual({ amount: 5 });
    });
  });
});
