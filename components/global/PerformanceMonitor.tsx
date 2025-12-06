'use client';

import { useEffect } from 'react';
import { performanceMetrics } from '@/lib/metrics/performance';

/**
 * Performance Monitor Component
 * Initializes performance tracking when the app loads
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Start tracking Web Vitals
    performanceMetrics.trackWebVitals();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Log metrics summary when user leaves the page
        const summary = performanceMetrics.getMetricsSummary();
        console.log('[Performance Summary]', summary);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Expose metrics to window for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      (window as any).__performanceMetrics = performanceMetrics;
      console.log(
        '%c[Performance Monitor] Initialized. Access metrics via window.__performanceMetrics',
        'color: #4CAF50; font-weight: bold;'
      );
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}

