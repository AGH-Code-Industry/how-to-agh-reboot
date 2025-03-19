import { procedure, router } from '../init';
import { prisma } from '@/prisma/prisma';
import { buildingDOtoDTO } from '@/types/Building';
import { z } from 'zod';

export const buildingsRouter = router({
  getBuildings: procedure
    .input(
      z.object({
        buildingId: z.number().positive().optional(),
      })
    )
    .query(async ({ input }) => {
      const filter = input.buildingId ? { building_id: input.buildingId } : {};

      const buildings = await prisma.building.findMany({
        where: filter,
        include: { building_entries: true },
      });

      if (input.buildingId) {
        if (buildings.length === 0) {
          throw new Error('Building not found');
        }
        return buildingDOtoDTO(buildings[0]);
      }

      return buildings.map(buildingDOtoDTO);
    }),
});
