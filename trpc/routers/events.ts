import { procedure, protectedProcedure, router } from '../init';
import { prisma } from '@/prisma/prisma';
import { eventDOtoDTO, eventTypeDOtoDTO, FieldOfStudyDOtoDTO } from '@/types/Event';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const eventsRouter = router({
  getEvents: protectedProcedure
    .input(
      z.object({
        eventTypeId: z.number().positive().optional(),
        eventId: z.number().positive().optional(),
        // Pagination parameters
        limit: z.number().min(1).max(100).default(50).optional(),
        cursor: z.number().optional(),
        // Option to include full details or minimal data
        includeDetails: z.boolean().default(true).optional(),
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

      // Determine what to include based on includeDetails flag
      const includeConfig = input.includeDetails
        ? {
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
                user_id: ctx.user.id,
              },
            },
          }
        : {
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
          };

      const events = (
        await prisma.event.findMany({
          where: filter,
          include: includeConfig,
          take: input.limit,
          skip: input.cursor,
          orderBy: {
            event_id: 'asc',
          },
        })
      ).map(eventDOtoDTO);

      return events;
    }),

  // New paginated endpoint with cursor-based pagination
  getEventsPaginated: protectedProcedure
    .input(
      z.object({
        eventTypeId: z.number().positive().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().optional(),
        includeDetails: z.boolean().default(true).optional(),
      })
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      const filter: Prisma.EventWhereInput = {};

      if (input.eventTypeId) {
        filter.event_type_id = input.eventTypeId;
      }

      if (input.cursor) {
        filter.event_id = {
          gt: input.cursor,
        };
      }

      const includeConfig = input.includeDetails
        ? {
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
                user_id: ctx.user.id,
              },
            },
          }
        : {
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
          };

      const events = await prisma.event.findMany({
        where: filter,
        include: includeConfig,
        take: input.limit + 1, // Fetch one extra to determine if there are more
        orderBy: {
          event_id: 'asc',
        },
      });

      let nextCursor: number | undefined = undefined;
      if (events.length > input.limit) {
        const nextItem = events.pop();
        nextCursor = nextItem?.event_id;
      }

      return {
        items: events.map(eventDOtoDTO),
        nextCursor,
      };
    }),
  getEventTypes: procedure.query(async () => {
    const eventTypes = (await prisma.eventType.findMany({})).map(eventTypeDOtoDTO);

    return eventTypes;
  }),
  getFieldsOfStudy: procedure.query(async () => {
    const fieldsOfStudy = (
      await prisma.fieldOfStudy.findMany({
        include: {
          faculty: true,
        },
      })
    ).map(FieldOfStudyDOtoDTO);
    return fieldsOfStudy;
  }),
});
