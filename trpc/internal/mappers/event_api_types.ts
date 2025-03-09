import { EventVisit as PrismaEventVisit } from '@prisma/client';
import { EventVisit } from '@/trpc/internal/types/event';

export const toDomainEventVisit = (ev: PrismaEventVisit): EventVisit => ({
  id: ev.event_visit_id,
  time: ev.time,
  eventId: ev.event_id,
  event: undefined,
  userId: ev.user_id,
  user: undefined,
  createdAt: ev.created_at,
  updatedAt: ev.updated_at,
});
