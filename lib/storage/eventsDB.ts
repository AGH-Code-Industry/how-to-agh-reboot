/**
 * IndexedDB Storage for Events
 * Caches event data locally for offline access
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { EventDTO } from '@/types/Event';

interface EventsDB extends DBSchema {
  events: {
    key: number;
    value: EventDTO & { cachedAt: number };
    indexes: { 'by-cached-at': number };
  };
  metadata: {
    key: string;
    value: {
      key: string;
      value: unknown;
      updatedAt: number;
    };
  };
}

const DB_NAME = 'how-to-agh-events';
const DB_VERSION = 1;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class EventsDatabase {
  private db: IDBPDatabase<EventsDB> | null = null;

  /**
   * Initialize the database
   */
  async init() {
    if (this.db) return this.db;

    try {
      this.db = await openDB<EventsDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create events store
          if (!db.objectStoreNames.contains('events')) {
            const eventsStore = db.createObjectStore('events', { keyPath: 'id' });
            eventsStore.createIndex('by-cached-at', 'cachedAt');
          }

          // Create metadata store
          if (!db.objectStoreNames.contains('metadata')) {
            db.createObjectStore('metadata', { keyPath: 'key' });
          }
        },
      });

      return this.db;
    } catch (error) {
      console.error('Failed to initialize events database:', error);
      throw error;
    }
  }

  /**
   * Store a single event
   */
  async storeEvent(event: EventDTO) {
    const db = await this.init();
    try {
      const cachedEvent = {
        ...event,
        cachedAt: Date.now(),
      };
      await db.put('events', cachedEvent);
    } catch (error) {
      console.error('Failed to store event:', error);
    }
  }

  /**
   * Store multiple events
   */
  async storeEvents(events: EventDTO[]) {
    const db = await this.init();
    const tx = db.transaction('events', 'readwrite');

    try {
      const cachedAt = Date.now();
      await Promise.all([
        ...events.map((event) =>
          tx.store.put({
            ...event,
            cachedAt,
          })
        ),
        tx.done,
      ]);

      // Update last sync timestamp
      await this.setMetadata('lastSync', cachedAt);
    } catch (error) {
      console.error('Failed to store events:', error);
    }
  }

  /**
   * Get a single event by ID
   */
  async getEvent(id: number): Promise<EventDTO | null> {
    const db = await this.init();
    try {
      const cachedEvent = await db.get('events', id);
      if (!cachedEvent) return null;

      // Check if cache is still valid
      if (Date.now() - cachedEvent.cachedAt > CACHE_DURATION) {
        return null;
      }

      // Remove cachedAt before returning
      const { cachedAt, ...event } = cachedEvent;
      return event as EventDTO;
    } catch (error) {
      console.error('Failed to get event:', error);
      return null;
    }
  }

  /**
   * Get all cached events
   */
  async getAllEvents(): Promise<EventDTO[]> {
    const db = await this.init();
    try {
      const cachedEvents = await db.getAll('events');
      const now = Date.now();

      // Filter out expired cache and remove cachedAt property
      return cachedEvents
        .filter((event) => now - event.cachedAt <= CACHE_DURATION)
        .map(({ cachedAt, ...event }) => event as EventDTO);
    } catch (error) {
      console.error('Failed to get all events:', error);
      return [];
    }
  }

  /**
   * Get events by type
   */
  async getEventsByType(eventTypeId: number): Promise<EventDTO[]> {
    const allEvents = await this.getAllEvents();
    return allEvents.filter((event) => event.eventType.id === eventTypeId);
  }

  /**
   * Check if cache is fresh
   */
  async isCacheFresh(): Promise<boolean> {
    const lastSync = await this.getMetadata('lastSync');
    if (!lastSync) return false;

    const timeSinceSync = Date.now() - (lastSync as number);
    return timeSinceSync < CACHE_DURATION;
  }

  /**
   * Get last sync timestamp
   */
  async getLastSync(): Promise<number | null> {
    const lastSync = await this.getMetadata('lastSync');
    return lastSync ? (lastSync as number) : null;
  }

  /**
   * Set metadata
   */
  async setMetadata(key: string, value: unknown) {
    const db = await this.init();
    try {
      await db.put('metadata', {
        key,
        value,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Failed to set metadata:', error);
    }
  }

  /**
   * Get metadata
   */
  async getMetadata(key: string): Promise<unknown | null> {
    const db = await this.init();
    try {
      const metadata = await db.get('metadata', key);
      return metadata?.value ?? null;
    } catch (error) {
      console.error('Failed to get metadata:', error);
      return null;
    }
  }

  /**
   * Clear old cached events
   */
  async clearOldCache() {
    const db = await this.init();
    const cutoffTime = Date.now() - CACHE_DURATION;

    try {
      const tx = db.transaction('events', 'readwrite');
      const index = tx.store.index('by-cached-at');
      const range = IDBKeyRange.upperBound(cutoffTime);

      let cursor = await index.openCursor(range);
      while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
      }

      await tx.done;
      console.log('Cleared old cached events');
    } catch (error) {
      console.error('Failed to clear old cache:', error);
    }
  }

  /**
   * Clear all cached events
   */
  async clearAllEvents() {
    const db = await this.init();
    try {
      await db.clear('events');
      await this.setMetadata('lastSync', null);
      console.log('Cleared all cached events');
    } catch (error) {
      console.error('Failed to clear all events:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    const db = await this.init();
    try {
      const totalEvents = await db.count('events');
      const lastSync = await this.getLastSync();
      const isFresh = await this.isCacheFresh();

      return {
        totalEvents,
        lastSync,
        isFresh,
        cacheAge: lastSync ? Date.now() - lastSync : null,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalEvents: 0,
        lastSync: null,
        isFresh: false,
        cacheAge: null,
      };
    }
  }

  /**
   * Close the database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const eventsDB = new EventsDatabase();

