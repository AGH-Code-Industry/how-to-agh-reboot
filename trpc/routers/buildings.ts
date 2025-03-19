import { procedure, router } from '../init';
import { prisma } from '@/prisma/prisma';
import { z } from 'zod';
import { buildingDOtoDTO } from '@/types/Building';

export const buildingsRouter = router({
  getBuildings: procedure
    .input(
      z.object({
        buildingId: z.number().positive().optional(),
      })
    )
    .query(async ({ input }) => {
      if (input.buildingId) {
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
      } else {
        const buildings = await prisma.building.findMany({
          include: {
            building_entries: true,
          },
        });
        return buildings.map(buildingDOtoDTO);
      }
    }),
});
