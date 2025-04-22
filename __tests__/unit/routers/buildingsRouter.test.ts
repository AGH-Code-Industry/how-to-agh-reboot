import { buildingsRouter } from '@/trpc/routers/buildings';
import { prisma } from '@/prisma/prisma';

jest.mock('../../../trpc/init', () => {
  const mockProcedure = {
    input: jest.fn().mockImplementation((schema) => ({
      query: jest.fn().mockImplementation((handler) => ({
        query: async (input: any) => {
          try {
            schema.parse(input);
            const ctx = { input };
            return handler(ctx);
          } catch (error) {
            throw new Error('Input validation failed');
          }
        },
        _def: {
          query: handler,
        },
      })),
    })),
  };

  return {
    procedure: mockProcedure,
    router: jest.fn().mockImplementation((routes) => ({
      createCaller: jest.fn().mockImplementation(() => ({
        getBuildings: async (input: any) => routes.getBuildings.query(input),
      })),
    })),
  };
});

jest.mock('@/types/Building', () => ({
  buildingDOtoDTO: (building: any) => ({
    id: building.building_id,
    name: building.name,
    entries: building.building_entries.map((entry: any) => ({
      id: entry.building_entry_id,
      latitude: entry.map_latitude,
      longitude: entry.map_longitude,
    })),
  }),
}));

const mockBuildings = [
  {
    building_id: 1,
    name: 'D17',
    created_at: new Date(),
    updated_at: new Date(),
    building_entries: [
      {
        building_entry_id: 1,
        building_id: 1,
        map_latitude: 50.0,
        map_longitude: 20.0,
        description: 'Main entrance',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        building_entry_id: 2,
        building_id: 1,
        map_latitude: 50.1,
        map_longitude: 20.1,
        description: 'Back entrance',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
  },
  {
    building_id: 2,
    name: 'B1',
    created_at: new Date(),
    updated_at: new Date(),
    building_entries: [],
  },
];

jest.mock('@/prisma/prisma', () => {
  const findManyMock = jest.fn();
  return {
    prisma: {
      building: {
        findMany: findManyMock,
      },
    },
  };
});

describe('buildingsRouter', () => {
  let findManySpy: jest.Mock;
  let caller: ReturnType<typeof buildingsRouter.createCaller>;

  beforeEach(() => {
    jest.clearAllMocks();
    findManySpy = prisma.building.findMany as jest.Mock;
    caller = buildingsRouter.createCaller({
      auth: false,
      user: null,
    });
  });

  it('should return all buildings', async () => {
    findManySpy.mockResolvedValueOnce(mockBuildings);
    const result = await caller.getBuildings({});

    expect(findManySpy).toHaveBeenCalledWith({
      where: {},
      include: { building_entries: true },
    });
    expect(result).toEqual([
      {
        id: 1,
        name: 'D17',
        entries: [
          {
            id: 1,
            latitude: 50.0,
            longitude: 20.0,
          },
          {
            id: 2,
            latitude: 50.1,
            longitude: 20.1,
          },
        ],
      },
      {
        id: 2,
        name: 'B1',
        entries: [],
      },
    ]);
  });

  it('should return a specific building by ID', async () => {
    const targetBuilding = mockBuildings[0];
    findManySpy.mockResolvedValueOnce([targetBuilding]);

    const result = await caller.getBuildings({ buildingId: 1 });

    expect(findManySpy).toHaveBeenCalledWith({
      where: { building_id: 1 },
      include: { building_entries: true },
    });
    expect(result).toEqual([
      {
        id: 1,
        name: 'D17',
        entries: [
          {
            id: 1,
            latitude: 50.0,
            longitude: 20.0,
          },
          {
            id: 2,
            latitude: 50.1,
            longitude: 20.1,
          },
        ],
      },
    ]);
  });

  it('should return empty array when building is not found', async () => {
    findManySpy.mockResolvedValueOnce([]);

    const result = await caller.getBuildings({ buildingId: 999 });

    expect(findManySpy).toHaveBeenCalledWith({
      where: { building_id: 999 },
      include: { building_entries: true },
    });
    expect(result).toEqual([]);
  });

  it('should throw error for invalid building ID', async () => {
    await expect(caller.getBuildings({ buildingId: -1 })).rejects.toThrow(
      'Input validation failed'
    );
  });

  it('should handle building with no entries', async () => {
    const buildingWithNoEntries = mockBuildings[1];
    findManySpy.mockResolvedValueOnce([buildingWithNoEntries]);

    const result = await caller.getBuildings({ buildingId: 2 });

    expect(findManySpy).toHaveBeenCalledWith({
      where: { building_id: 2 },
      include: { building_entries: true },
    });
    expect(result).toEqual([
      {
        id: 2,
        name: 'B1',
        entries: [],
      },
    ]);
  });
});
