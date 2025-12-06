'use client';

import { useState, useEffect } from 'react';
import { EventDTO } from '@/types/Event';
import { eventsDB } from '@/lib/storage/eventsDB';
import { useOfflineDetection } from './useOfflineDetection';
import { logger } from '@/lib/logging/logger';
import { metricsCollector } from '@/lib/metrics/collector';

interface UseOfflineEventsOptions {
  eventTypeId?: number;
  enableCache?: boolean;
}

/**
 * Hook for fetching events with offline support
 * Automatically falls back to cached data when offline
 */
export function useOfflineEvents(
  fetchEvents: () => Promise<EventDTO[]>,
  options: UseOfflineEventsOptions = {}
) {
  const { eventTypeId, enableCache = true } = options;
  const { isOnline, wasOffline } = useOfflineDetection();
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isOnline) {
          // Try to fetch from network
          logger.info('Fetching events from network');
          const fetchedEvents = await fetchEvents();

          if (!isMounted) return;

          setEvents(fetchedEvents);
          setIsFromCache(false);

          // Cache the events if caching is enabled
          if (enableCache) {
            logger.info('Caching events to IndexedDB', {
              count: fetchedEvents.length,
            });
            await eventsDB.storeEvents(fetchedEvents);
            metricsCollector.trackAction('events_cached', 'events', {
              count: fetchedEvents.length,
            });
          }
        } else {
          // Load from cache when offline
          logger.info('Loading events from cache (offline mode)');
          const cachedEvents = eventTypeId
            ? await eventsDB.getEventsByType(eventTypeId)
            : await eventsDB.getAllEvents();

          if (!isMounted) return;

          setEvents(cachedEvents);
          setIsFromCache(true);

          metricsCollector.trackAction('events_loaded_from_cache', 'events', {
            count: cachedEvents.length,
          });

          if (cachedEvents.length === 0) {
            logger.warn('No cached events available in offline mode');
          }
        }
      } catch (err) {
        if (!isMounted) return;

        const error = err instanceof Error ? err : new Error('Failed to load events');
        logger.error('Failed to load events', error);
        setError(error);

        // Try to load from cache as fallback
        if (enableCache) {
          logger.info('Attempting to load from cache as fallback');
          try {
            const cachedEvents = eventTypeId
              ? await eventsDB.getEventsByType(eventTypeId)
              : await eventsDB.getAllEvents();

            if (!isMounted) return;

            if (cachedEvents.length > 0) {
              setEvents(cachedEvents);
              setIsFromCache(true);
              logger.info('Successfully loaded events from cache as fallback', {
                count: cachedEvents.length,
              });
            }
          } catch (cacheErr) {
            logger.error('Failed to load from cache', cacheErr);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [isOnline, eventTypeId, enableCache, wasOffline]);

  /**
   * Manually refresh events
   */
  const refresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        logger.warn('Cannot refresh events while offline');
        throw new Error('Cannot refresh while offline');
      }

      logger.info('Manually refreshing events');
      const fetchedEvents = await fetchEvents();

      setEvents(fetchedEvents);
      setIsFromCache(false);

      if (enableCache) {
        await eventsDB.storeEvents(fetchedEvents);
      }

      metricsCollector.trackAction('events_refreshed', 'events', {
        count: fetchedEvents.length,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh events');
      logger.error('Failed to refresh events', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear cached events
   */
  const clearCache = async () => {
    try {
      logger.info('Clearing events cache');
      await eventsDB.clearAllEvents();
      metricsCollector.trackAction('events_cache_cleared', 'events');
    } catch (err) {
      logger.error('Failed to clear events cache', err);
    }
  };

  return {
    events,
    isLoading,
    error,
    isFromCache,
    isOnline,
    refresh,
    clearCache,
  };
}

