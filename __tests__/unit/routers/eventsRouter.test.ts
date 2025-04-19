import { eventsRouter } from '@/trpc/routers/events';
import { prisma } from '@/prisma/prisma';
import { EventDTO } from '@/types/Event';

jest.mock('../../../trpc/init', () => {
  const mockProcedure = {
    input: jest.fn().mockImplementation((schema) => ({
      query: jest.fn().mockImplementation((handler) => ({
        query: async (input: any) => {
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
          query: handler,
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
        getEvents: async (input: any) => routes.getEvents.query(input),
        getEventTypes: async () => routes.getEventTypes.query(),
        getFieldsOfStudy: async () => routes.getFieldsOfStudy.query(),
      })),
    })),
  };
});

jest.mock('@/types/Event', () => ({
  eventDOtoDTO: (event: any) => ({
    id: event.event_id,
    name: event.name,
    description: event.description,
    display: event.should_be_displayed,
    latidute: event.location_latitude,
    longitude: event.location_longitude,
    building: {
      id: event.building_room.building.building_id,
      name: event.building_room.building.name,
      floor: event.building_room.floor === 0 ? 'parter' : `piętro ${event.building_room.floor}`,
      room: event.building_room.room,
    },
    eventType: {
      id: event.event_type.event_type_id,
      name: event.event_type.name,
      color: event.event_type.color,
    },
    occurrences: event.event_occurrences.map((eo: any) => ({
      id: eo.occurrence.occurrence_id,
      start: eo.occurrence.start_time,
      end: eo.occurrence.end_time,
    })),
    fieldOfStudy: event.event_field_of_studies.map((efs: any) => ({
      id: efs.field_of_study.field_of_study_id,
      name: efs.field_of_study.name,
      faculty: {
        id: efs.field_of_study.faculty.faculty_id,
        name: efs.field_of_study.faculty.name,
      },
    })),
    visited: event.event_visits.length > 0,
  }),
  eventTypeDOtoDTO: (eventType: any) => ({
    id: eventType.event_type_id,
    name: eventType.name,
    color: eventType.color,
  }),
  FieldOfStudyDOtoDTO: (fieldOfStudy: any) => ({
    id: fieldOfStudy.field_of_study_id,
    name: fieldOfStudy.name,
    faculty: {
      id: fieldOfStudy.faculty.faculty_id,
      name: fieldOfStudy.faculty.name,
    },
  }),
}));

const mockEvents = [
  {
    event_id: 1,
    name: 'Workshop 1',
    description: 'Description 1',
    should_be_displayed: true,
    location_latitude: 50.0678,
    location_longitude: 19.9127,
    building_room: {
      building: {
        building_id: 1,
        name: 'Building 1',
      },
      floor: 1,
      room: '101',
    },
    event_type: {
      event_type_id: 1,
      name: 'Workshop',
      color: '#FF0000',
    },
    event_occurrences: [
      {
        occurrence: {
          occurrence_id: 1,
          start_time: new Date('2025-04-19T10:00:00Z'),
          end_time: new Date('2025-04-19T12:00:00Z'),
        },
      },
    ],
    event_field_of_studies: [
      {
        field_of_study: {
          field_of_study_id: 1,
          name: 'Computer Science',
          faculty: {
            faculty_id: 1,
            name: 'Faculty of Computer Science',
          },
        },
      },
    ],
    event_visits: [{ user_id: '1' }],
  },
  {
    event_id: 2,
    name: 'Lecture 1',
    description: 'Description 2',
    should_be_displayed: true,
    location_latitude: 50.0679,
    location_longitude: 19.9128,
    building_room: {
      building: {
        building_id: 2,
        name: 'Building 2',
      },
      floor: 0,
      room: '001',
    },
    event_type: {
      event_type_id: 2,
      name: 'Lecture',
      color: '#00FF00',
    },
    event_occurrences: [],
    event_field_of_studies: [],
    event_visits: [],
  },
];

const mockEventTypes = [
  {
    event_type_id: 1,
    name: 'Workshop',
    color: '#FF0000',
  },
  {
    event_type_id: 2,
    name: 'Lecture',
    color: '#00FF00',
  },
];

const mockFieldsOfStudy = [
  {
    field_of_study_id: 1,
    name: 'Computer Science',
    faculty: {
      faculty_id: 1,
      name: 'Faculty of Computer Science',
    },
  },
  {
    field_of_study_id: 2,
    name: 'Electronics',
    faculty: {
      faculty_id: 2,
      name: 'Faculty of Electronics',
    },
  },
];

jest.mock('@/prisma/prisma', () => {
  const findManyEventsMock = jest.fn();
  const findManyEventTypesMock = jest.fn();
  const findManyFieldsOfStudyMock = jest.fn();
  return {
    prisma: {
      event: {
        findMany: findManyEventsMock,
      },
      eventType: {
        findMany: findManyEventTypesMock,
      },
      fieldOfStudy: {
        findMany: findManyFieldsOfStudyMock,
      },
    },
  };
});

describe('eventsRouter', () => {
  let findManyEventsSpy: jest.Mock;
  let findManyEventTypesSpy: jest.Mock;
  let findManyFieldsOfStudySpy: jest.Mock;
  let caller: ReturnType<typeof eventsRouter.createCaller>;

  beforeEach(() => {
    jest.clearAllMocks();
    findManyEventsSpy = prisma.event.findMany as jest.Mock;
    findManyEventTypesSpy = prisma.eventType.findMany as jest.Mock;
    findManyFieldsOfStudySpy = prisma.fieldOfStudy.findMany as jest.Mock;
    caller = eventsRouter.createCaller({
      auth: true,
      user: {
        id: '1',
        email: 'test@example.com',
        isAnonymous: false,
      },
    });
  });

  describe('getEvents', () => {
    it('should return all events when no filters are provided', async () => {
      findManyEventsSpy.mockResolvedValueOnce(mockEvents);
      const result: EventDTO[] = await caller.getEvents({});

      expect(findManyEventsSpy).toHaveBeenCalledWith({
        where: {},
        include: {
          building_room: {
            include: {
              building: true,
            },
          },
          event_type: true,
          event_occurrences: {
            include: {
              occurrence: true,
            },
          },
          event_field_of_studies: {
            include: {
              field_of_study: {
                include: {
                  faculty: true,
                },
              },
            },
          },
          event_visits: {
            where: {
              user_id: '1',
            },
          },
        },
      });

      expect(result).toEqual([
        {
          id: 1,
          name: 'Workshop 1',
          description: 'Description 1',
          display: true,
          latidute: 50.0678,
          longitude: 19.9127,
          building: {
            id: 1,
            name: 'Building 1',
            floor: 'piętro 1',
            room: '101',
          },
          eventType: {
            id: 1,
            name: 'Workshop',
            color: '#FF0000',
          },
          occurrences: [
            {
              id: 1,
              start: new Date('2025-04-19T10:00:00Z'),
              end: new Date('2025-04-19T12:00:00Z'),
            },
          ],
          fieldOfStudy: [
            {
              id: 1,
              name: 'Computer Science',
              faculty: {
                id: 1,
                name: 'Faculty of Computer Science',
              },
            },
          ],
          visited: true,
        },
        {
          id: 2,
          name: 'Lecture 1',
          description: 'Description 2',
          display: true,
          latidute: 50.0679,
          longitude: 19.9128,
          building: {
            id: 2,
            name: 'Building 2',
            floor: 'parter',
            room: '001',
          },
          eventType: {
            id: 2,
            name: 'Lecture',
            color: '#00FF00',
          },
          occurrences: [],
          fieldOfStudy: [],
          visited: false,
        },
      ]);
    });

    it('should filter events by event type ID', async () => {
      findManyEventsSpy.mockResolvedValueOnce([mockEvents[0]]);
      const result: EventDTO[] = await caller.getEvents({ eventTypeId: 1 });

      expect(findManyEventsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { event_type_id: 1 },
        })
      );

      expect(result).toHaveLength(1);
      expect(result[0].eventType.id).toBe(1);
    });

    it('should filter events by event ID', async () => {
      findManyEventsSpy.mockResolvedValueOnce([mockEvents[1]]);
      const result: EventDTO[] = await caller.getEvents({ eventId: 2 });

      expect(findManyEventsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { event_id: 2 },
        })
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should throw error for invalid event type ID', async () => {
      await expect(caller.getEvents({ eventTypeId: -1 })).rejects.toThrow(
        'Input validation failed'
      );
    });

    it('should throw error for invalid event ID', async () => {
      await expect(caller.getEvents({ eventId: -1 })).rejects.toThrow('Input validation failed');
    });
  });

  describe('getEventTypes', () => {
    it('should return all event types', async () => {
      findManyEventTypesSpy.mockResolvedValueOnce(mockEventTypes);
      const result = await caller.getEventTypes();

      expect(findManyEventTypesSpy).toHaveBeenCalledWith({});
      expect(result).toEqual([
        {
          id: 1,
          name: 'Workshop',
          color: '#FF0000',
        },
        {
          id: 2,
          name: 'Lecture',
          color: '#00FF00',
        },
      ]);
    });
  });

  describe('getFieldsOfStudy', () => {
    it('should return all fields of study', async () => {
      findManyFieldsOfStudySpy.mockResolvedValueOnce(mockFieldsOfStudy);
      const result = await caller.getFieldsOfStudy();

      expect(findManyFieldsOfStudySpy).toHaveBeenCalledWith({
        include: {
          faculty: true,
        },
      });
      expect(result).toEqual([
        {
          id: 1,
          name: 'Computer Science',
          faculty: {
            id: 1,
            name: 'Faculty of Computer Science',
          },
        },
        {
          id: 2,
          name: 'Electronics',
          faculty: {
            id: 2,
            name: 'Faculty of Electronics',
          },
        },
      ]);
    });
  });
});
