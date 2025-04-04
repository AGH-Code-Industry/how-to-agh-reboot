import { prisma } from '@/prisma/prisma';
import { procedure, router } from '../init';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { tourDOtoDTO } from '@/types/Tour';

export const toursRouter = router({
  getTours: procedure
    .input(
      z.object({
        tourId: z.number().positive().optional(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      const filter: Prisma.TourWhereInput = {};

      if (input.tourId) {
        filter.tour_id = input.tourId;
      }

      const tours = (
        await prisma.tour.findMany({
          where: filter,
          include: {
            event_occurrences: {
              include: {
                event: true,
                occurrence: true,
              },
            },
          },
        })
      ).map(tourDOtoDTO);

      return tours;
    }),
});
