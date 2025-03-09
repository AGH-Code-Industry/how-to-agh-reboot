import { User } from '@prisma/client';

export interface EventVisit {
  id: number;
  time: Date;
  eventId: number;
  event?: Event;
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
