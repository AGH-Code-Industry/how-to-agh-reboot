import { procedure, router } from '../init';
import { prisma } from '@/prisma/prisma';
import { z } from 'zod';
import { buildingDOtoDTO, buildingEntryDOtoDTO } from '@/types/Building';

export const buildingsRouter = router({
  getBuildings: procedure.query(async () => {
    const buildings = await prisma.building.findMany({
      include: {
        building_entries: true,
      },
    });
    return buildings.map(buildingDOtoDTO);
  }),

  getBuildingById: procedure
    .input(
      z.object({
        buildingId: z.number().positive(),
      })
    )
    .query(async ({ input }) => {
      const building = await prisma.building.findUnique({
        where: {
          building_id: input.buildingId,
        },
        include: {
          building_entries: true,
        },
      });
      if (!building) {
        throw new Error('Building not found');
      }
      return buildingDOtoDTO(building);
    }),

  getBuildingEntries: procedure
    .input(
      z.object({
        buildingId: z.number().positive().optional(),
      })
    )
    .query(async ({ input }) => {
      const whereClause = input.buildingId ? { building_id: input.buildingId } : {};
      const entries = await prisma.buildingEntry.findMany({
        where: whereClause,
        include: {
          building: true,
        },
      });
      return entries.map(buildingEntryDOtoDTO);
    }),
});
