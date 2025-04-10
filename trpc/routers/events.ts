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
