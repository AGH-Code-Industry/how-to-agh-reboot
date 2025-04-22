import { ratingRouter } from '../../../trpc/routers/rating';
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
  };

  return {
    protectedProcedure: mockProcedure,
    router: jest.fn().mockImplementation((routes) => ({
      createCaller: jest.fn().mockImplementation(() => ({
        rateEvent: async (input: any) => routes.rateEvent.mutation(input),
      })),
    })),
  };
});

jest.mock('@/prisma/prisma', () => {
  const findFirstEventVisitMock = jest.fn();
  const findFirstEventRatingMock = jest.fn();
  const createEventRatingMock = jest.fn();

  return {
    prisma: {
      eventVisit: {
        findFirst: findFirstEventVisitMock,
      },
      eventRating: {
        findFirst: findFirstEventRatingMock,
        create: createEventRatingMock,
      },
    },
  };
});

describe('ratingRouter', () => {
  let eventVisitFindFirstSpy: jest.Mock;
  let eventRatingFindFirstSpy: jest.Mock;
  let eventRatingCreateSpy: jest.Mock;
  let caller: ReturnType<typeof ratingRouter.createCaller>;

  beforeEach(() => {
    jest.clearAllMocks();
    eventVisitFindFirstSpy = prisma.eventVisit.findFirst as jest.Mock;
    eventRatingFindFirstSpy = prisma.eventRating.findFirst as jest.Mock;
    eventRatingCreateSpy = prisma.eventRating.create as jest.Mock;
    caller = ratingRouter.createCaller({
      auth: true,
      user: {
        id: '1',
        email: 'test@example.com',
        isAnonymous: false,
      },
    });
  });

  it('should successfully rate an event', async () => {
    eventVisitFindFirstSpy.mockResolvedValueOnce({
      user_id: '1',
      event_id: 1,
    });
    eventRatingFindFirstSpy.mockResolvedValueOnce(null);
    eventRatingCreateSpy.mockResolvedValueOnce({
      user_id: '1',
      event_id: 1,
      rating: 5,
    });

    const result = await caller.rateEvent({
      eventId: 1,
      rating: 5,
    });

    expect(eventVisitFindFirstSpy).toHaveBeenCalledWith({
      where: {
        user_id: '1',
        event_id: 1,
      },
    });
    expect(eventRatingFindFirstSpy).toHaveBeenCalledWith({
      where: {
        user_id: '1',
        event_id: 1,
      },
    });
    expect(eventRatingCreateSpy).toHaveBeenCalledWith({
      data: {
        user_id: '1',
        event_id: 1,
        rating: 5,
      },
    });
    expect(result).toEqual({
      type: 'success',
      message: 'Pomyślnie zapisano ocenę wydarzenia!',
    });
  });

  it('should return error when trying to rate unvisited event', async () => {
    eventVisitFindFirstSpy.mockResolvedValueOnce(null);

    const result = await caller.rateEvent({
      eventId: 1,
      rating: 5,
    });

    expect(eventVisitFindFirstSpy).toHaveBeenCalledWith({
      where: {
        user_id: '1',
        event_id: 1,
      },
    });
    expect(eventRatingFindFirstSpy).not.toHaveBeenCalled();
    expect(eventRatingCreateSpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      type: 'error',
      message: 'Aby ocenić wydarzenie musisz je najpierw odwiedzić poprzez zeskanowanie kodu QR.',
    });
  });

  it('should return info when event is already rated', async () => {
    eventVisitFindFirstSpy.mockResolvedValueOnce({
      user_id: '1',
      event_id: 1,
    });
    eventRatingFindFirstSpy.mockResolvedValueOnce({
      user_id: '1',
      event_id: 1,
      rating: 5,
    });

    const result = await caller.rateEvent({
      eventId: 1,
      rating: 4,
    });

    expect(eventVisitFindFirstSpy).toHaveBeenCalledWith({
      where: {
        user_id: '1',
        event_id: 1,
      },
    });
    expect(eventRatingFindFirstSpy).toHaveBeenCalledWith({
      where: {
        user_id: '1',
        event_id: 1,
      },
    });
    expect(eventRatingCreateSpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      type: 'info',
      message: 'To wydarzenie zostało już przez Ciebie ocenione.',
    });
  });

  it('should throw error for invalid eventId', async () => {
    await expect(
      caller.rateEvent({
        eventId: -1,
        rating: 5,
      })
    ).rejects.toThrow('Input validation failed');
  });

  it('should throw error for invalid rating', async () => {
    await expect(
      caller.rateEvent({
        eventId: 1,
        rating: -1,
      })
    ).rejects.toThrow('Input validation failed');
  });
});
