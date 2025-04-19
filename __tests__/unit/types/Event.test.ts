import {
  FieldOfStudyDOtoDTO,
  eventDOtoDTO,
  eventTypeDOtoDTO,
  EventDO,
  EventTypeDO,
  FieldOfStudyDO,
} from '@/types/Event';

describe('Event Types', () => {
  describe('FieldOfStudyDOtoDTO', () => {
    it('should correctly transform FieldOfStudy with Faculty to DTO', () => {
      const mockFieldOfStudy: FieldOfStudyDO = {
        field_of_study_id: 1,
        name: 'Computer Science',
        faculty_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        faculty: {
          faculty_id: 1,
          name: 'Faculty of Computer Science',
          created_at: new Date(),
          updated_at: new Date(),
        },
      };

      const result = FieldOfStudyDOtoDTO(mockFieldOfStudy);

      expect(result).toEqual({
        id: 1,
        name: 'Computer Science',
        faculty: {
          id: 1,
          name: 'Faculty of Computer Science',
        },
      });
    });
  });

  describe('eventTypeDOtoDTO', () => {
    it('should correctly transform EventType to DTO', () => {
      const mockEventType: EventTypeDO = {
        event_type_id: 1,
        name: 'Workshop',
        color: '#FF0000',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = eventTypeDOtoDTO(mockEventType);

      expect(result).toEqual({
        id: 1,
        name: 'Workshop',
        color: '#FF0000',
      });
    });
  });

  describe('eventDOtoDTO', () => {
    it('should correctly transform Event with all relations to DTO', () => {
      const mockEvent: EventDO = {
        event_id: 1,
        name: 'Programming Workshop',
        description: 'Learn to code',
        should_be_displayed: true,
        location_latitude: 50.06789,
        location_longitude: 19.912345,
        building_room_id: 1,
        event_type_id: 1,
        qr_id: 1,
        owner_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        building_room: {
          building_room_id: 1,
          building_id: 1,
          room: '123',
          floor: 1,
          created_at: new Date(),
          updated_at: new Date(),
          building: {
            building_id: 1,
            name: 'D-17',
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
        event_type: {
          event_type_id: 1,
          name: 'Workshop',
          color: '#FF0000',
          created_at: new Date(),
          updated_at: new Date(),
        },
        event_visits: [
          {
            event_visit_id: 1,
            event_id: 1,
            user_id: '1',
            time: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        event_occurrences: [
          {
            event_occurrence_id: 1,
            event_id: 1,
            occurrence_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            occurrence: {
              occurrence_id: 1,
              start_time: new Date('2025-04-19T10:00:00Z'),
              end_time: new Date('2025-04-19T12:00:00Z'),
              created_at: new Date(),
              updated_at: new Date(),
            },
          },
        ],
        event_field_of_studies: [
          {
            event_field_of_study_id: 1,
            event_id: 1,
            field_of_study_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            field_of_study: {
              field_of_study_id: 1,
              name: 'Computer Science',
              faculty_id: 1,
              created_at: new Date(),
              updated_at: new Date(),
              faculty: {
                faculty_id: 1,
                name: 'Faculty of Computer Science',
                created_at: new Date(),
                updated_at: new Date(),
              },
            },
          },
        ],
      };

      const result = eventDOtoDTO(mockEvent);

      expect(result).toEqual({
        id: 1,
        name: 'Programming Workshop',
        description: 'Learn to code',
        display: true,
        latidute: 50.06789,
        longitude: 19.912345,
        eventType: {
          id: 1,
          name: 'Workshop',
          color: '#FF0000',
        },
        building: {
          id: 1,
          name: 'D-17',
          floor: 'piętro 1',
          room: '123',
        },
        occurrences: [
          {
            id: 1,
            start: new Date('2025-04-19T10:00:00Z'),
            end: new Date('2025-04-19T12:00:00Z'),
          },
        ],
        fieldOfStudy: [
          {
            id: 1,
            name: 'Computer Science',
            faculty: {
              id: 1,
              name: 'Faculty of Computer Science',
            },
          },
        ],
        visited: true,
      });
    });

    it('should handle ground floor correctly', () => {
      const mockEvent: EventDO = {
        ...defaultMockEvent,
        building_room: {
          ...defaultMockEvent.building_room,
          floor: 0,
        },
      };

      const result = eventDOtoDTO(mockEvent);

      expect(result.building.floor).toBe('parter');
    });

    it('should handle event with no visits', () => {
      const mockEvent: EventDO = {
        ...defaultMockEvent,
        event_visits: [],
      };

      const result = eventDOtoDTO(mockEvent);

      expect(result.visited).toBe(false);
    });
  });
});

// Helper mock data
const defaultMockEvent: EventDO = {
  event_id: 1,
  name: 'Programming Workshop',
  description: 'Learn to code',
  should_be_displayed: true,
  location_latitude: 50.06789,
  location_longitude: 19.912345,
  building_room_id: 1,
  event_type_id: 1,
  qr_id: 1,
  owner_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  building_room: {
    building_room_id: 1,
    building_id: 1,
    room: '123',
    floor: 1,
    created_at: new Date(),
    updated_at: new Date(),
    building: {
      building_id: 1,
      name: 'D-17',
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  event_type: {
    event_type_id: 1,
    name: 'Workshop',
    color: '#FF0000',
    created_at: new Date(),
    updated_at: new Date(),
  },
  event_visits: [
    {
      event_visit_id: 1,
      event_id: 1,
      user_id: '1',
      time: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
  event_occurrences: [
    {
      event_occurrence_id: 1,
      event_id: 1,
      occurrence_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      occurrence: {
        occurrence_id: 1,
        start_time: new Date('2025-04-19T10:00:00Z'),
        end_time: new Date('2025-04-19T12:00:00Z'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    },
  ],
  event_field_of_studies: [
    {
      event_field_of_study_id: 1,
      event_id: 1,
      field_of_study_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      field_of_study: {
        field_of_study_id: 1,
        name: 'Computer Science',
        faculty_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        faculty: {
          faculty_id: 1,
          name: 'Faculty of Computer Science',
          created_at: new Date(),
          updated_at: new Date(),
        },
      },
    },
  ],
};
