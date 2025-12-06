/**
 * Structured Logging Service
 * Provides centralized logging with different log levels and storage
 */

import { logsDB } from '@/lib/storage/logsDB';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id?: number;
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
  stack?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private logs: LogEntry[] = [];
  private maxStoredLogs = 1000;
  private logLevel: LogLevel = 'info';
  private listeners: Array<(log: LogEntry) => void> = [];

  constructor() {
    // Set log level based on environment
    if (typeof window !== 'undefined') {
      this.logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
    }
  }

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  /**
   * Get the current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    stack?: string
  ): LogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      context,
      stack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  /**
   * Store a log entry
   */
  private storeLog(log: LogEntry) {
    this.logs.push(log);

    // Trim logs if exceeding max
    if (this.logs.length > this.maxStoredLogs) {
      this.logs = this.logs.slice(-this.maxStoredLogs);
    }

    // Store in IndexedDB (async, don't wait)
    if (typeof window !== 'undefined') {
      logsDB.storeLog(log).catch((error) => {
        console.error('Failed to store log in IndexedDB:', error);
      });
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(log));
  }

  /**
   * Format log for console output
   */
  private formatLogForConsole(log: LogEntry): string {
    const timestamp = new Date(log.timestamp).toISOString();
    const contextStr = log.context ? ` | ${JSON.stringify(log.context)}` : '';
    return `[${timestamp}] [${log.level.toUpperCase()}] ${log.message}${contextStr}`;
  }

  /**
   * Output log to console
   */
  private outputToConsole(log: LogEntry) {
    const formatted = this.formatLogForConsole(log);

    switch (log.level) {
      case 'debug':
        console.debug(formatted, log.context);
        break;
      case 'info':
        console.info(formatted, log.context);
        break;
      case 'warn':
        console.warn(formatted, log.context);
        break;
      case 'error':
        console.error(formatted, log.context);
        if (log.stack) {
          console.error('Stack trace:', log.stack);
        }
        break;
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog('debug')) return;

    const log = this.createLogEntry('debug', message, context);
    this.storeLog(log);
    this.outputToConsole(log);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog('info')) return;

    const log = this.createLogEntry('info', message, context);
    this.storeLog(log);
    this.outputToConsole(log);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog('warn')) return;

    const log = this.createLogEntry('warn', message, context);
    this.storeLog(log);
    this.outputToConsole(log);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    if (!this.shouldLog('error')) return;

    let stack: string | undefined;
    let errorContext = { ...context };

    if (error instanceof Error) {
      stack = error.stack;
      errorContext = {
        ...errorContext,
        errorName: error.name,
        errorMessage: error.message,
      };
    } else if (error) {
      errorContext = {
        ...errorContext,
        error: String(error),
      };
    }

    const log = this.createLogEntry('error', message, errorContext, stack);
    this.storeLog(log);
    this.outputToConsole(log);
  }

  /**
   * Log an API call
   */
  logAPICall(
    method: string,
    endpoint: string,
    status: number,
    duration: number,
    success: boolean
  ) {
    const level = success ? 'info' : 'error';
    const message = `API ${method} ${endpoint}`;
    const context = {
      method,
      endpoint,
      status,
      duration,
      success,
    };

    if (this.shouldLog(level)) {
      const log = this.createLogEntry(level, message, context);
      this.storeLog(log);
      
      if (process.env.NODE_ENV === 'development') {
        this.outputToConsole(log);
      }
    }
  }

  /**
   * Log a user action
   */
  logUserAction(action: string, target: string, metadata?: Record<string, unknown>) {
    this.info(`User action: ${action}`, {
      action,
      target,
      ...metadata,
    });
  }

  /**
   * Log a page view
   */
  logPageView(path: string, metadata?: Record<string, unknown>) {
    this.info(`Page view: ${path}`, {
      path,
      ...metadata,
    });
  }

  /**
   * Get all logs
   */
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get logs in time range
   */
  getLogsInRange(startTime: number, endTime: number): LogEntry[] {
    return this.logs.filter((log) => log.timestamp >= startTime && log.timestamp <= endTime);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit = 100): LogEntry[] {
    return this.logs.slice(-limit);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Add a log listener
   */
  addListener(listener: (log: LogEntry) => void) {
    this.listeners.push(listener);
  }

  /**
   * Remove a log listener
   */
  removeListener(listener: (log: LogEntry) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Export logs as CSV
   */
  exportLogsAsCSV(): string {
    const headers = ['Timestamp', 'Level', 'Message', 'Context', 'URL'];
    const rows = this.logs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.level,
      log.message,
      log.context ? JSON.stringify(log.context) : '',
      log.url || '',
    ]);

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
  }
}

// Export singleton instance
export const logger = new Logger();

// Expose logger to window for debugging (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__logger = logger;
}

