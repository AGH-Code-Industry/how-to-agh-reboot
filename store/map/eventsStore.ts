import { EventDTO } from '@/types/Event';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventFilterMask = {
  search: string;
  eventType: string;
  fieldOfStudy: string;
  startTime: string;
  endTime: string;
  showPastEvents: boolean;
};

type UseEventsStore = {
  filterChangeCounter: number;
  eventsFromDB: EventDTO[];
  eventsFiltered: EventDTO[];
  eventsFilterMask: EventFilterMask;
  resetEventFilterMask: () => void;
  setEventsFromDB: (events: EventDTO[]) => void;
  setEventsFilterMask: (mask: EventFilterMask) => void;
};

export const useEventsStore = create<UseEventsStore>()(
  persist(
    (set, get) => ({
      filterChangeCounter: 0,
      eventsFromDB: [],
      eventsFiltered: [],
      eventsFilterMask: {
        search: '',
        eventType: '-',
        fieldOfStudy: '-',
        startTime: '',
        endTime: '',
        showPastEvents: false,
      },

      setEventsFromDB: (events) => {
        const filterMask = get().eventsFilterMask;
        set({
          eventsFromDB: [...events],
          eventsFiltered: filterData(events, filterMask),
        });
      },

      setEventsFilterMask: (mask) => {
        const eventsFromDB = get().eventsFromDB;
        set({
          eventsFilterMask: { ...mask },
          eventsFiltered: filterData(eventsFromDB, mask),
          filterChangeCounter: get().filterChangeCounter + 1,
        });
      },

      resetEventFilterMask: () => {
        const mask: EventFilterMask = {
          search: '',
          eventType: '-',
          fieldOfStudy: '-',
          startTime: '',
          endTime: '',
          showPastEvents: false,
        };
        const eventsFromDB = get().eventsFromDB;
        set({
          eventsFilterMask: mask,
          eventsFiltered: filterData(eventsFromDB, mask),
          filterChangeCounter: get().filterChangeCounter + 1,
        });
      },
    }),
    {
      name: 'events-storage',
      partialize: (state) => ({
        eventsFilterMask: state.eventsFilterMask,
      }),
    }
  )
);

const filterData = (eventsFromDB: EventDTO[], filterMask: EventFilterMask) => {
  const startDate: Date | null = getFilterDateFromHourString(filterMask.startTime);
  const endDate: Date | null = getFilterDateFromHourString(filterMask.endTime);

  return eventsFromDB
    .map((el) => {
      const newOccurrences = getFilteredOccurrences(el, startDate, endDate, filterMask);
      return { ...el, occurrences: newOccurrences };
    })
    .filter((event) => {
      const checkSearch = () =>
        filterMask.search === '' ||
        event.name.toLowerCase().includes(filterMask.search.toLowerCase()) ||
        event.description?.toLowerCase().includes(filterMask.search.toLowerCase());

      const checkEventType = () =>
        filterMask.eventType === '-' || event.eventType.name === filterMask.eventType;

      const checkDate = () => event.occurrences.length > 0;

      const isAvailableFieldOfStudy = () =>
        filterMask.fieldOfStudy === '-' ||
        event.fieldOfStudy.some((el) => el.name === filterMask.fieldOfStudy);

      return (
        event.display &&
        checkSearch() &&
        checkEventType() &&
        checkDate() &&
        isAvailableFieldOfStudy()
      );
    });
};

const getFilterDateFromHourString = (time: string) => {
  if (time == '') return null;
  const [hours, minutes] = time.split(':');
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hours, +minutes);
};

function getFilteredOccurrences(
  event: EventDTO,
  startDate: Date | null,
  endDate: Date | null,
  filterMask: EventFilterMask
) {
  return event.occurrences.filter((occurrence) => {
    const occStartHour = new Date(occurrence.start);
    const occEndHour = new Date(occurrence.end);

    if (
      (!startDate || occStartHour.getTime() >= startDate.getTime()) &&
      (!endDate || occEndHour.getTime() <= endDate.getTime()) &&
      (filterMask.showPastEvents || occStartHour.getTime() >= Date.now())
    ) {
      return true;
    }
    return false;
  });
}
