import { act } from 'react';
import { useEventsStore } from '@/store/map/eventsStore';
import { EventDTO } from '@/types/Event';

// Ustawiamy Date.now() jako stały moment w czasie
const now = new Date(2024, 3, 20, 12, 0, 0);
jest.spyOn(global.Date, 'now').mockImplementation(() => now.getTime());

global.Date = class extends Date {
  constructor(...args: ConstructorParameters<typeof Date>) {
    if (args.length === (0 as number)) {
      super(now.getTime());
    } else {
      super(...args);
    }
  }
} as DateConstructor;

jest.mock('zustand/middleware', () => {
  const actual = jest.requireActual('zustand/middleware');
  return {
    ...actual,
    persist: (config: any) => config, // wyłącza persist
  };
});

describe('useEventsStore - setEventsFromDB', () => {
  beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    useEventsStore.setState(useEventsStore.getInitialState());
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  const mockEvents: EventDTO[] = getMockEvents(now);

  it('should set eventsFromDB and correctly filter visible upcoming events', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    const { eventsFromDB, eventsFiltered, eventsFilterMask } = useEventsStore.getState();

    expect(eventsFromDB).toHaveLength(3);

    expect(eventsFilterMask).toEqual({
      search: '',
      eventType: '-',
      fieldOfStudy: '-',
      startTime: '',
      endTime: '',
      showPastEvents: false,
    });

    expect(eventsFiltered).toHaveLength(1);
    expect(eventsFiltered[0].name).toBe('AI Workshop');
  });

  it('should update eventsFilterMask and filter events accordingly', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: 'AI',
        eventType: '-',
        fieldOfStudy: '-',
        startTime: '',
        endTime: '',
        showPastEvents: false,
      });
    });

    const { eventsFiltered, eventsFilterMask, filterChangeCounter } = useEventsStore.getState();

    expect(eventsFilterMask.search).toBe('AI');
    expect(eventsFiltered).toHaveLength(1);
    expect(eventsFiltered[0].name).toBe('AI Workshop');
    expect(filterChangeCounter).toBe(1);
  });

  it('should filter events by eventType', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: '',
        eventType: 'Lecture',
        fieldOfStudy: '-',
        startTime: '',
        endTime: '',
        showPastEvents: true,
      });
    });

    const { eventsFiltered } = useEventsStore.getState();

    expect(eventsFiltered).toHaveLength(1);
    expect(eventsFiltered[0].name).toBe('Old Event');
  });

  it('should filter events by startTime and endTime', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: '',
        eventType: '-',
        fieldOfStudy: '-',
        startTime: '12:00',
        endTime: '14:00',
        showPastEvents: true,
      });
    });

    const { eventsFiltered } = useEventsStore.getState();

    expect(eventsFiltered).toHaveLength(1);
    expect(eventsFiltered[0].name).toBe('AI Workshop');
  });

  it('should filter events to include only past events when showPastEvents is true', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: '',
        eventType: '-',
        fieldOfStudy: '-',
        startTime: '',
        endTime: '',
        showPastEvents: true,
      });
    });

    const { eventsFiltered } = useEventsStore.getState();

    expect(eventsFiltered).toHaveLength(2);
    expect(eventsFiltered.map((event) => event.name)).toContain('Old Event');
    expect(eventsFiltered.map((event) => event.name)).toContain('AI Workshop');
  });

  it('should filter events to exclude past events when showPastEvents is false', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: '',
        eventType: '-',
        fieldOfStudy: '-',
        startTime: '',
        endTime: '',
        showPastEvents: false,
      });
    });

    const { eventsFiltered } = useEventsStore.getState();

    expect(eventsFiltered).toHaveLength(1);
    expect(eventsFiltered[0].name).toBe('AI Workshop');
  });

  it('should filter events by startTime only', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: '',
        eventType: '-',
        fieldOfStudy: '-',
        startTime: '13:00',
        endTime: '',
        showPastEvents: true,
      });
    });

    const { eventsFiltered } = useEventsStore.getState();

    expect(eventsFiltered).toHaveLength(1);
    expect(eventsFiltered[0].name).toBe('AI Workshop');
  });

  it('should filter events by endTime only', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: '',
        eventType: '-',
        fieldOfStudy: '-',
        startTime: '',
        endTime: '14:00',
        showPastEvents: true,
      });
    });

    const { eventsFiltered } = useEventsStore.getState();

    expect(eventsFiltered).toHaveLength(2);
    expect(eventsFiltered.map((event) => event.name)).toContain('AI Workshop');
    expect(eventsFiltered.map((event) => event.name)).toContain('Old Event');
  });

  it('should reset eventsFilterMask to default and filter events accordingly', () => {
    act(() => {
      useEventsStore.getState().setEventsFromDB(mockEvents);
    });

    act(() => {
      useEventsStore.getState().setEventsFilterMask({
        search: 'AI',
        eventType: 'Workshop',
        fieldOfStudy: 'Computer Science',
        startTime: '10:00',
        endTime: '12:00',
        showPastEvents: true,
      });
    });

    act(() => {
      useEventsStore.getState().resetEventFilterMask();
    });

    const { eventsFiltered, eventsFilterMask, filterChangeCounter } = useEventsStore.getState();

    expect(eventsFilterMask).toEqual({
      search: '',
      eventType: '-',
      fieldOfStudy: '-',
      startTime: '',
      endTime: '',
      showPastEvents: false,
    });

    expect(eventsFiltered).toHaveLength(1);
    expect(eventsFiltered[0].name).toBe('AI Workshop');
    expect(filterChangeCounter).toBe(2);
  });
});

function getMockEvents(now: Date) {
  const mockEvents: EventDTO[] = [
    {
      id: 1,
      name: 'AI Workshop',
      description: 'Learn about AI',
      eventType: {
        name: 'Workshop',
        id: 0,
        color: '#ff0000',
      },
      fieldOfStudy: [
        {
          name: 'Computer Science',
          id: 0,
          faculty: {
            id: 0,
            name: 'Informatics',
          },
        },
      ],
      display: true,
      occurrences: [
        {
          start: new Date(now.getTime() + 60 * 60 * 1000), // za 1h
          end: new Date(now.getTime() + 2 * 60 * 60 * 1000),
          id: 0,
        },
      ],
      latidute: 0,
      longitude: 0,
      building: {
        id: 0,
        name: '',
        floor: '',
        room: '',
      },
      visited: false,
    },
    {
      id: 2,
      name: 'Old Event',
      description: 'Past event',
      eventType: {
        name: 'Lecture',
        id: 0,
        color: '',
      },
      fieldOfStudy: [
        {
          name: 'Math',
          id: 0,
          faculty: {
            id: 0,
            name: '',
          },
        },
      ],
      display: true,
      occurrences: [
        {
          start: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3h temu
          end: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          id: 0,
        },
      ],
      latidute: 0,
      longitude: 0,
      building: {
        id: 0,
        name: '',
        floor: '',
        room: '',
      },
      visited: false,
    },
    {
      id: 3,
      name: 'Hidden Event',
      description: 'Not displayed',
      eventType: {
        name: 'Seminar',
        id: 0,
        color: '',
      },
      fieldOfStudy: [
        {
          name: 'Physics',
          id: 0,
          faculty: {
            id: 0,
            name: '',
          },
        },
      ],
      display: false,
      occurrences: [
        {
          start: new Date(now.getTime() + 2 * 60 * 60 * 1000),
          end: new Date(now.getTime() + 3 * 60 * 60 * 1000),
          id: 0,
        },
      ],
      latidute: 0,
      longitude: 0,
      building: {
        id: 0,
        name: '',
        floor: '',
        room: '',
      },
      visited: false,
    },
  ];
  return mockEvents;
}
