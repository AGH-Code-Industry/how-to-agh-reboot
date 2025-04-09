import { procedure, protectedProcedure, router } from '../init';
import { prisma } from '@/prisma/prisma';
import { eventDOtoDTO, eventTypeDOtoDTO } from '@/types/Event';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const eventsRouter = router({
  getEvents: protectedProcedure
    .input(
      z.object({
        eventTypeId: z.number().positive().optional(),
        tourId: z.number().positive().optional(),
        eventId: z.number().positive().optional(),
      })
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      const filter: Prisma.EventWhereInput = {};

      if (input.eventTypeId) {
        filter.event_type_id = input.eventTypeId;
      }

      if (input.eventId) {
        filter.event_id = input.eventId;
      }

      if (input.tourId) {
        filter.event_occurrences = {
          some: {
            tour_id: input.tourId,
          },
        };
      }

      const events = (
        await prisma.event.findMany({
          where: filter,
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
                tour: true,
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
                user_id: ctx.user.id,
              },
            },
          },
        })
      ).map(eventDOtoDTO);

      return events;
    }),
  getEventTypes: procedure.query(async () => {
    const eventTypes = (await prisma.eventType.findMany({})).map(eventTypeDOtoDTO);

    return eventTypes;
  }),
});
