/**
 * IndexedDB Storage for Logs
 * Stores application logs locally for debugging and analysis
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { LogEntry, LogLevel } from '@/lib/logging/logger';

interface LogsDB extends DBSchema {
  logs: {
    key: number;
    value: LogEntry;
    indexes: { 'by-timestamp': number; 'by-level': LogLevel };
  };
}

const DB_NAME = 'how-to-agh-logs';
const DB_VERSION = 1;

class LogsDatabase {
  private db: IDBPDatabase<LogsDB> | null = null;

  /**
   * Initialize the database
   */
  async init() {
    if (this.db) return this.db;

    try {
      this.db = await openDB<LogsDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('logs')) {
            const logsStore = db.createObjectStore('logs', {
              keyPath: 'id',
              autoIncrement: true,
            });
            logsStore.createIndex('by-timestamp', 'timestamp');
            logsStore.createIndex('by-level', 'level');
          }
        },
      });

      return this.db;
    } catch (error) {
      console.error('Failed to initialize logs database:', error);
      throw error;
    }
  }

  /**
   * Store a log entry
   */
  async storeLog(log: LogEntry) {
    const db = await this.init();
    try {
      await db.add('logs', log);
    } catch (error) {
      console.error('Failed to store log:', error);
    }
  }

  /**
   * Store multiple log entries
   */
  async storeLogs(logs: LogEntry[]) {
    const db = await this.init();
    const tx = db.transaction('logs', 'readwrite');

    try {
      await Promise.all([...logs.map((log) => tx.store.add(log)), tx.done]);
    } catch (error) {
      console.error('Failed to store logs:', error);
    }
  }

  /**
   * Get all logs
   */
  async getAllLogs(): Promise<LogEntry[]> {
    const db = await this.init();
    try {
      return await db.getAll('logs');
    } catch (error) {
      console.error('Failed to get all logs:', error);
      return [];
    }
  }

  /**
   * Get logs by level
   */
  async getLogsByLevel(level: LogLevel): Promise<LogEntry[]> {
    const db = await this.init();
    try {
      return await db.getAllFromIndex('logs', 'by-level', level);
    } catch (error) {
      console.error('Failed to get logs by level:', error);
      return [];
    }
  }

  /**
   * Get logs in time range
   */
  async getLogsInRange(startTime: number, endTime: number): Promise<LogEntry[]> {
    const db = await this.init();
    try {
      const range = IDBKeyRange.bound(startTime, endTime);
      return await db.getAllFromIndex('logs', 'by-timestamp', range);
    } catch (error) {
      console.error('Failed to get logs in range:', error);
      return [];
    }
  }

  /**
   * Get recent logs
   */
  async getRecentLogs(limit = 100): Promise<LogEntry[]> {
    const db = await this.init();
    try {
      const allLogs = await db.getAll('logs');
      return allLogs.slice(-limit);
    } catch (error) {
      console.error('Failed to get recent logs:', error);
      return [];
    }
  }

  /**
   * Get error logs
   */
  async getErrorLogs(): Promise<LogEntry[]> {
    return this.getLogsByLevel('error');
  }

  /**
   * Get warning logs
   */
  async getWarningLogs(): Promise<LogEntry[]> {
    return this.getLogsByLevel('warn');
  }

  /**
   * Clear old logs (older than specified days)
   */
  async clearOldLogs(daysToKeep = 7) {
    const db = await this.init();
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

    try {
      const tx = db.transaction('logs', 'readwrite');
      const index = tx.store.index('by-timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);

      let cursor = await index.openCursor(range);
      while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
      }

      await tx.done;
      console.log(`Cleared logs older than ${daysToKeep} days`);
    } catch (error) {
      console.error('Failed to clear old logs:', error);
    }
  }

  /**
   * Clear all logs
   */
  async clearAllLogs() {
    const db = await this.init();
    try {
      await db.clear('logs');
      console.log('Cleared all logs');
    } catch (error) {
      console.error('Failed to clear all logs:', error);
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    const db = await this.init();
    try {
      const totalLogs = await db.count('logs');
      const errorLogs = await db.countFromIndex('logs', 'by-level', 'error');
      const warnLogs = await db.countFromIndex('logs', 'by-level', 'warn');

      return {
        totalLogs,
        errorLogs,
        warnLogs,
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return {
        totalLogs: 0,
        errorLogs: 0,
        warnLogs: 0,
      };
    }
  }

  /**
   * Export logs as JSON
   */
  async exportLogsAsJSON(): Promise<string> {
    const logs = await this.getAllLogs();
    return JSON.stringify(logs, null, 2);
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
export const logsDB = new LogsDatabase();

