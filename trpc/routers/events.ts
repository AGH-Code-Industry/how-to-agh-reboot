import { procedure, protectedProcedure, router } from '../init';
import { prisma } from '@/prisma/prisma';
import { eventDOtoDTO, eventTypeDOtoDTO } from '@/types/Event';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const eventsRouter = router({
  getEvents: protectedProcedure
    .input(
      z.object({
        eventTypeId: z.number().positive().optional(),
        tourId: z.number().positive().optional(),
      })
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      const filter: Prisma.EventWhereInput = {};

      if (input.eventTypeId) {
        filter.event_type_id = input.eventTypeId;
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
            building: true,
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
  getEvent: procedure
    .input(
      z.object({
        id: z.number().positive(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;

      const event = await prisma.event.findUnique({
        where: { event_id: input.id },
        include: {
          building: true,
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
        },
      });

      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      return eventDOtoDTO(event);
    }),
  getEventTypes: procedure.query(async () => {
    const eventTypes = (await prisma.eventType.findMany({})).map(eventTypeDOtoDTO);

    return eventTypes;
  }),
});
