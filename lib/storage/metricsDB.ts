/**
 * IndexedDB Storage for Metrics
 * Stores metrics data locally for analysis and offline access
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Metric } from '@/lib/metrics/collector';

interface MetricsDB extends DBSchema {
  metrics: {
    key: number;
    value: Metric & { id?: number };
    indexes: { 'by-timestamp': number; 'by-type': string };
  };
  metricsSummary: {
    key: string;
    value: {
      date: string;
      summary: Record<string, unknown>;
    };
  };
}

const DB_NAME = 'how-to-agh-metrics';
const DB_VERSION = 1;

class MetricsDatabase {
  private db: IDBPDatabase<MetricsDB> | null = null;

  /**
   * Initialize the database
   */
  async init() {
    if (this.db) return this.db;

    try {
      this.db = await openDB<MetricsDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create metrics store
          if (!db.objectStoreNames.contains('metrics')) {
            const metricsStore = db.createObjectStore('metrics', {
              keyPath: 'id',
              autoIncrement: true,
            });
            metricsStore.createIndex('by-timestamp', 'timestamp');
            metricsStore.createIndex('by-type', 'type');
          }

          // Create metrics summary store
          if (!db.objectStoreNames.contains('metricsSummary')) {
            db.createObjectStore('metricsSummary', { keyPath: 'date' });
          }
        },
      });

      return this.db;
    } catch (error) {
      console.error('Failed to initialize metrics database:', error);
      throw error;
    }
  }

  /**
   * Store a metric
   */
  async storeMetric(metric: Metric) {
    const db = await this.init();
    try {
      await db.add('metrics', metric);
    } catch (error) {
      console.error('Failed to store metric:', error);
    }
  }

  /**
   * Store multiple metrics
   */
  async storeMetrics(metrics: Metric[]) {
    const db = await this.init();
    const tx = db.transaction('metrics', 'readwrite');
    
    try {
      await Promise.all([
        ...metrics.map((metric) => tx.store.add(metric)),
        tx.done,
      ]);
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }
  }

  /**
   * Get all metrics
   */
  async getAllMetrics(): Promise<Metric[]> {
    const db = await this.init();
    try {
      return await db.getAll('metrics');
    } catch (error) {
      console.error('Failed to get all metrics:', error);
      return [];
    }
  }

  /**
   * Get metrics by type
   */
  async getMetricsByType(type: string): Promise<Metric[]> {
    const db = await this.init();
    try {
      return await db.getAllFromIndex('metrics', 'by-type', type);
    } catch (error) {
      console.error('Failed to get metrics by type:', error);
      return [];
    }
  }

  /**
   * Get metrics in time range
   */
  async getMetricsInRange(startTime: number, endTime: number): Promise<Metric[]> {
    const db = await this.init();
    try {
      const range = IDBKeyRange.bound(startTime, endTime);
      return await db.getAllFromIndex('metrics', 'by-timestamp', range);
    } catch (error) {
      console.error('Failed to get metrics in range:', error);
      return [];
    }
  }

  /**
   * Get recent metrics
   */
  async getRecentMetrics(limit = 100): Promise<Metric[]> {
    const db = await this.init();
    try {
      const allMetrics = await db.getAll('metrics');
      return allMetrics.slice(-limit);
    } catch (error) {
      console.error('Failed to get recent metrics:', error);
      return [];
    }
  }

  /**
   * Store daily summary
   */
  async storeDailySummary(date: string, summary: Record<string, unknown>) {
    const db = await this.init();
    try {
      await db.put('metricsSummary', { date, summary });
    } catch (error) {
      console.error('Failed to store daily summary:', error);
    }
  }

  /**
   * Get daily summary
   */
  async getDailySummary(date: string) {
    const db = await this.init();
    try {
      return await db.get('metricsSummary', date);
    } catch (error) {
      console.error('Failed to get daily summary:', error);
      return null;
    }
  }

  /**
   * Clear old metrics (older than specified days)
   */
  async clearOldMetrics(daysToKeep = 7) {
    const db = await this.init();
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

    try {
      const tx = db.transaction('metrics', 'readwrite');
      const index = tx.store.index('by-timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      
      let cursor = await index.openCursor(range);
      while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
      }
      
      await tx.done;
      console.log(`Cleared metrics older than ${daysToKeep} days`);
    } catch (error) {
      console.error('Failed to clear old metrics:', error);
    }
  }

  /**
   * Clear all metrics
   */
  async clearAllMetrics() {
    const db = await this.init();
    try {
      await db.clear('metrics');
      console.log('Cleared all metrics');
    } catch (error) {
      console.error('Failed to clear all metrics:', error);
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    const db = await this.init();
    try {
      const metricsCount = await db.count('metrics');
      const summariesCount = await db.count('metricsSummary');
      
      return {
        totalMetrics: metricsCount,
        totalSummaries: summariesCount,
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return {
        totalMetrics: 0,
        totalSummaries: 0,
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
export const metricsDB = new MetricsDatabase();

