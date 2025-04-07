import {
  Building,
  EventFieldOfStudy,
  EventOccurrence,
  EventType,
  Faculty,
  FieldOfStudy,
  Occurrence,
  Tour,
  Event,
  EventVisit,
} from '@prisma/client';

export type EventDO = Event & { building: Building } & { event_type: EventType } & {
  event_visits: EventVisit[];
} & {
  event_occurrences: (EventOccurrence & { occurrence: Occurrence } & { tour: Tour })[];
} & {
  event_field_of_studies: (EventFieldOfStudy & {
    field_of_study: FieldOfStudy & { faculty: Faculty };
  })[];
};

export type EventDTO = {
  id: EventDO['event_id'];
  name: EventDO['name'];
  description: EventDO['description'];
  display: EventDO['should_be_displayed'];
  latidute: EventDO['location_latitude'];
  longitude: EventDO['location_longitude'];
  eventType: EventDO['event_type']['name'];
  building: {
    id: EventDO['building']['building_id'];
    name: EventDO['building']['name'];
  };
  occurrences: {
    start: EventDO['event_occurrences'][0]['occurrence']['start_time'];
    end: EventDO['event_occurrences'][0]['occurrence']['end_time'];
    tourId: EventDO['event_occurrences'][0]['tour_id'];
  }[];
  fieldOfStudy: {
    name: EventDO['event_field_of_studies'][0]['field_of_study']['name'];
    faculty: {
      id: EventDO['event_field_of_studies'][0]['field_of_study']['faculty']['faculty_id'];
      name: EventDO['event_field_of_studies'][0]['field_of_study']['faculty']['name'];
    };
  }[];
  visited: boolean;
};

export const eventDOtoDTO = (data: EventDO): EventDTO => ({
  id: data.event_id,
  name: data.name,
  description: data.description,
  display: data.should_be_displayed,
  latidute: data.location_latitude,
  longitude: data.location_longitude,
  eventType: data.event_type.name,
  building: {
    id: data.building.building_id,
    name: data.building.name,
  },
  occurrences: data.event_occurrences.map((eo) => ({
    start: eo.occurrence.start_time,
    end: eo.occurrence.end_time,
    tourId: eo.tour_id,
  })),
  fieldOfStudy: data.event_field_of_studies.map((fos) => ({
    name: fos.field_of_study.name,
    faculty: {
      id: fos.field_of_study.faculty_id,
      name: fos.field_of_study.faculty.name,
    },
  })),
  visited: data.event_visits.length > 0,
});

export type EventTypeDO = EventType;

export type EventTypeDTO = {
  id: EventTypeDO['event_type_id'];
  name: EventTypeDO['name'];
};

export const eventTypeDOtoDTO = (data: EventTypeDO): EventTypeDTO => ({
  id: data.event_type_id,
  name: data.name,
});
