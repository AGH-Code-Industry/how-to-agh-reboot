import { Tour, EventOccurrence, Occurrence, Event } from '@prisma/client';

export type TourDO = Tour & {
  event_occurrences: (EventOccurrence & { event: Event } & { occurrence: Occurrence })[];
};

export type TourDTO = {
  id: TourDO['tour_id'];
  name: TourDO['name'];
  description: TourDO['description'];
  events: {
    start: TourDO['event_occurrences'][0]['occurrence']['start_time'];
    end: TourDO['event_occurrences'][0]['occurrence']['end_time'];
    eventId: TourDO['event_occurrences'][0]['event_id'];
  }[];
};

export const tourDOtoDTO = (data: TourDO): TourDTO => ({
  id: data.tour_id,
  name: data.name,
  description: data.description,
  events: data.event_occurrences.map((eo) => ({
    start: eo.occurrence.start_time,
    end: eo.occurrence.end_time,
    eventId: eo.event_id,
  })),
});
