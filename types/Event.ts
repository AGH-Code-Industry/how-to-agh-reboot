import {
  Building,
  BuildingRoom,
  Event,
  EventFieldOfStudy,
  EventOccurrence,
  EventType,
  EventVisit,
  Faculty,
  FieldOfStudy,
  Occurrence,
} from '@prisma/client';

export type EventDO = Event & { building_room: BuildingRoom & { building: Building } } & {
  event_type: EventType;
} & {
  event_visits: EventVisit[];
} & {
  event_occurrences: (EventOccurrence & { occurrence: Occurrence })[];
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
  eventType: EventTypeDTO;
  building: {
    id: EventDO['building_room']['building_id'];
    name: EventDO['building_room']['building']['name'];
    floor: string;
    room: EventDO['building_room']['room'];
  };
  occurrences: EventOccurrenceDTO[];
  fieldOfStudy: FieldOfStudyDTO[];
  visited: boolean;
};

export type FieldOfStudyDTO = {
  id: EventDO['event_field_of_studies'][0]['field_of_study']['field_of_study_id'];
  name: EventDO['event_field_of_studies'][0]['field_of_study']['name'];
  faculty: {
    id: EventDO['event_field_of_studies'][0]['field_of_study']['faculty']['faculty_id'];
    name: EventDO['event_field_of_studies'][0]['field_of_study']['faculty']['name'];
  };
};

export type EventOccurrenceDTO = {
  start: EventDO['event_occurrences'][0]['occurrence']['start_time'];
  end: EventDO['event_occurrences'][0]['occurrence']['end_time'];
};

export const eventDOtoDTO = (data: EventDO): EventDTO => ({
  id: data.event_id,
  name: data.name,
  description: data.description,
  display: data.should_be_displayed,
  latidute: data.location_latitude,
  longitude: data.location_longitude,
  eventType: eventTypeDOtoDTO(data.event_type),
  building: {
    id: data.building_room.building.building_id,
    name: data.building_room.building.name,
    floor: data.building_room.floor === 0 ? 'parter' : `piętro ${data.building_room.floor}`,
    room: data.building_room.room,
  },
  occurrences: data.event_occurrences.map((eo) => ({
    start: eo.occurrence.start_time,
    end: eo.occurrence.end_time,
  })),
  fieldOfStudy: data.event_field_of_studies.map(
    (fos): FieldOfStudyDTO => ({
      id: fos.field_of_study.field_of_study_id,
      name: fos.field_of_study.name,
      faculty: {
        id: fos.field_of_study.faculty_id,
        name: fos.field_of_study.faculty.name,
      },
    })
  ),
  visited: data.event_visits.length > 0,
});

export type EventTypeDO = EventType;

export type EventTypeDTO = {
  id: EventTypeDO['event_type_id'];
  name: EventTypeDO['name'];
  color: EventTypeDO['color'];
};

export const eventTypeDOtoDTO = (data: EventTypeDO): EventTypeDTO => ({
  id: data.event_type_id,
  name: data.name,
  color: data.color,
});
