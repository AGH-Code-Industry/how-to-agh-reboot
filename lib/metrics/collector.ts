/**
 * Metrics Collection Service
 * Centralized service for collecting and managing application metrics
 */

export interface TechnicalMetric {
  type: 'api_call' | 'page_load' | 'error' | 'performance';
  name: string;
  value: number;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export interface UsageMetric {
  type: 'page_view' | 'user_action' | 'feature_usage' | 'navigation';
  name: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export interface ErrorMetric {
  type: 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: number;
}

export type Metric = TechnicalMetric | UsageMetric | ErrorMetric;

/**
 * Metrics Collector Manager
 */
class MetricsCollector {
  private technicalMetrics: TechnicalMetric[] = [];
  private usageMetrics: UsageMetric[] = [];
  private errorMetrics: ErrorMetric[] = [];
  private maxStoredMetrics = 500;
  private flushInterval = 60000; // 1 minute
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.startAutoFlush();
    }
  }

  /**
   * Collect a technical metric
   */
  collectTechnical(metric: Omit<TechnicalMetric, 'timestamp'>) {
    const fullMetric: TechnicalMetric = {
      ...metric,
      timestamp: Date.now(),
    };

    this.technicalMetrics.push(fullMetric);
    this.trimMetrics();

    if (process.env.NODE_ENV === 'development') {
      console.log('[Metrics] Technical:', fullMetric);
    }
  }

  /**
   * Collect a usage metric
   */
  collectUsage(metric: Omit<UsageMetric, 'timestamp'>) {
    const fullMetric: UsageMetric = {
      ...metric,
      timestamp: Date.now(),
    };

    this.usageMetrics.push(fullMetric);
    this.trimMetrics();

    if (process.env.NODE_ENV === 'development') {
      console.log('[Metrics] Usage:', fullMetric);
    }
  }

  /**
   * Collect an error metric
   */
  collectError(metric: Omit<ErrorMetric, 'timestamp' | 'type'>) {
    const fullMetric: ErrorMetric = {
      ...metric,
      type: 'error',
      timestamp: Date.now(),
    };

    this.errorMetrics.push(fullMetric);
    this.trimMetrics();

    console.error('[Metrics] Error:', fullMetric);
  }

  /**
   * Track page view
   */
  trackPageView(path: string, metadata?: Record<string, unknown>) {
    this.collectUsage({
      type: 'page_view',
      name: path,
      metadata: {
        ...metadata,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    });
  }

  /**
   * Track user action
   */
  trackAction(action: string, target: string, metadata?: Record<string, unknown>) {
    this.collectUsage({
      type: 'user_action',
      name: action,
      metadata: {
        target,
        ...metadata,
      },
    });
  }

  /**
   * Track feature usage
   */
  trackFeature(featureName: string, metadata?: Record<string, unknown>) {
    this.collectUsage({
      type: 'feature_usage',
      name: featureName,
      metadata,
    });
  }

  /**
   * Track API call
   */
  trackAPICall(
    endpoint: string,
    method: string,
    duration: number,
    status: number,
    success: boolean
  ) {
    this.collectTechnical({
      type: 'api_call',
      name: `${method} ${endpoint}`,
      value: duration,
      metadata: {
        endpoint,
        method,
        status,
        success,
      },
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(name: string, value: number, metadata?: Record<string, unknown>) {
    this.collectTechnical({
      type: 'performance',
      name,
      value,
      metadata,
    });
  }

  /**
   * Track error
   */
  trackError(
    message: string,
    severity: ErrorMetric['severity'] = 'medium',
    context?: Record<string, unknown>,
    stack?: string
  ) {
    this.collectError({
      severity,
      message,
      stack,
      context,
    });
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    return {
      technical: [...this.technicalMetrics],
      usage: [...this.usageMetrics],
      errors: [...this.errorMetrics],
    };
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary() {
    const now = Date.now();
    const last24Hours = now - 24 * 60 * 60 * 1000;

    const recentTechnical = this.technicalMetrics.filter((m) => m.timestamp > last24Hours);
    const recentUsage = this.usageMetrics.filter((m) => m.timestamp > last24Hours);
    const recentErrors = this.errorMetrics.filter((m) => m.timestamp > last24Hours);

    return {
      technical: {
        total: recentTechnical.length,
        byType: this.groupByType(recentTechnical),
        avgValues: this.calculateAverages(recentTechnical),
      },
      usage: {
        total: recentUsage.length,
        byType: this.groupByType(recentUsage),
        topActions: this.getTopActions(recentUsage),
      },
      errors: {
        total: recentErrors.length,
        bySeverity: this.groupBySeverity(recentErrors),
      },
      timeRange: {
        start: last24Hours,
        end: now,
      },
    };
  }

  private groupByType<T extends { type: string }>(metrics: T[]) {
    return metrics.reduce((acc, metric) => {
      acc[metric.type] = (acc[metric.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupBySeverity(errors: ErrorMetric[]) {
    return errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateAverages(metrics: TechnicalMetric[]) {
    const byName = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(byName).reduce((acc, [name, values]) => {
      acc[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
      return acc;
    }, {} as Record<string, number>);
  }

  private getTopActions(metrics: UsageMetric[], limit = 10) {
    const actionCounts = metrics.reduce((acc, metric) => {
      acc[metric.name] = (acc[metric.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  }

  /**
   * Trim metrics to max stored limit
   */
  private trimMetrics() {
    if (this.technicalMetrics.length > this.maxStoredMetrics) {
      this.technicalMetrics = this.technicalMetrics.slice(-this.maxStoredMetrics);
    }
    if (this.usageMetrics.length > this.maxStoredMetrics) {
      this.usageMetrics = this.usageMetrics.slice(-this.maxStoredMetrics);
    }
    if (this.errorMetrics.length > this.maxStoredMetrics) {
      this.errorMetrics = this.errorMetrics.slice(-this.maxStoredMetrics);
    }
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush() {
    this.flushTimer = setInterval(() => {
      this.flushMetrics();
    }, this.flushInterval);
  }

  /**
   * Flush metrics (can be extended to send to backend)
   */
  private flushMetrics() {
    const summary = this.getMetricsSummary();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Metrics] Auto-flush summary:', summary);
    }

  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.technicalMetrics = [];
    this.usageMetrics = [];
    this.errorMetrics = [];
  }

  /**
   * Stop auto-flush
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

export const metricsCollector = new MetricsCollector();

