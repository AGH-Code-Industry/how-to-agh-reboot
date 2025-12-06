/**
 * Performance Metrics Service
 * Tracks Web Vitals and custom performance metrics for monitoring application stability
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url?: string;
}

export interface APIMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
  success: boolean;
}

export interface UserInteractionMetric {
  action: string;
  target: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

/**
 * Get rating based on metric value and thresholds
 */
function getRating(
  metricName: keyof typeof THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Performance Metrics Manager
 */
class PerformanceMetricsManager {
  private metrics: PerformanceMetric[] = [];
  private apiMetrics: APIMetric[] = [];
  private interactionMetrics: UserInteractionMetric[] = [];
  private maxStoredMetrics = 100;

  /**
   * Track Web Vitals using the Web Vitals API
   */
  trackWebVitals() {
    if (typeof window === 'undefined') return;

    // Track Largest Contentful Paint (LCP)
    this.observeLCP();

    // Track First Input Delay (FID)
    this.observeFID();

    // Track Cumulative Layout Shift (CLS)
    this.observeCLS();

    // Track Time to First Byte (TTFB)
    this.observeTTFB();

    // Track First Contentful Paint (FCP)
    this.observeFCP();
  }

  private observeLCP() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };

        const value = lastEntry.renderTime || lastEntry.loadTime || 0;
        this.recordMetric({
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          timestamp: Date.now(),
          url: window.location.pathname,
        });
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.error('Error observing LCP:', error);
    }
  }

  private observeFID() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number };
          const value = fidEntry.processingStart
            ? fidEntry.processingStart - entry.startTime
            : 0;

          this.recordMetric({
            name: 'FID',
            value,
            rating: getRating('FID', value),
            timestamp: Date.now(),
            url: window.location.pathname,
          });
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.error('Error observing FID:', error);
    }
  }

  private observeCLS() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        });

        this.recordMetric({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          timestamp: Date.now(),
          url: window.location.pathname,
        });
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.error('Error observing CLS:', error);
    }
  }

  private observeTTFB() {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.recordMetric({
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          timestamp: Date.now(),
          url: window.location.pathname,
        });
      }
    } catch (error) {
      console.error('Error observing TTFB:', error);
    }
  }

  private observeFCP() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric({
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime),
              timestamp: Date.now(),
              url: window.location.pathname,
            });
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.error('Error observing FCP:', error);
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only the last N metrics
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(-this.maxStoredMetrics);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric.name}:`, {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        url: metric.url,
      });
    }
  }

  /**
   * Track API call performance
   */
  trackAPICall(metric: APIMetric) {
    this.apiMetrics.push(metric);
    
    if (this.apiMetrics.length > this.maxStoredMetrics) {
      this.apiMetrics = this.apiMetrics.slice(-this.maxStoredMetrics);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${metric.method} ${metric.endpoint}:`, {
        duration: `${metric.duration}ms`,
        status: metric.status,
        success: metric.success,
      });
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(interaction: UserInteractionMetric) {
    this.interactionMetrics.push(interaction);
    
    if (this.interactionMetrics.length > this.maxStoredMetrics) {
      this.interactionMetrics = this.interactionMetrics.slice(-this.maxStoredMetrics);
    }
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    return {
      performance: [...this.metrics],
      api: [...this.apiMetrics],
      interactions: [...this.interactionMetrics],
    };
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary() {
    const summary = {
      performance: {} as Record<string, { avg: number; min: number; max: number; count: number }>,
      api: {
        totalCalls: this.apiMetrics.length,
        avgDuration: 0,
        successRate: 0,
      },
      interactions: {
        totalInteractions: this.interactionMetrics.length,
      },
    };

    // Calculate performance metrics summary
    const metricsByName = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(metricsByName).forEach(([name, values]) => {
      summary.performance[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    });

    // Calculate API metrics summary
    if (this.apiMetrics.length > 0) {
      summary.api.avgDuration =
        this.apiMetrics.reduce((sum, m) => sum + m.duration, 0) / this.apiMetrics.length;
      summary.api.successRate =
        (this.apiMetrics.filter((m) => m.success).length / this.apiMetrics.length) * 100;
    }

    return summary;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = [];
    this.apiMetrics = [];
    this.interactionMetrics = [];
  }
}

// Export singleton instance
export const performanceMetrics = new PerformanceMetricsManager();

