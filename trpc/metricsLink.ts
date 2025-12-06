/**
 * tRPC Metrics Link
 * Custom tRPC link to track API call performance
 */

import { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import { metricsCollector } from '@/lib/metrics/collector';
import { performanceMetrics } from '@/lib/metrics/performance';

/**
 * Create a metrics tracking link for tRPC
 */
export function metricsLink<TRouter>(): TRPCLink<TRouter> {
  return () => {
    return ({ next, op }) => {
      const startTime = Date.now();
      const path = op.path;
      const type = op.type;

      return observable((observer) => {
        const unsubscribe = next(op).subscribe({
          next(value) {
            const duration = Date.now() - startTime;

            // Track successful API call
            metricsCollector.trackAPICall(
              path,
              type.toUpperCase(),
              duration,
              200,
              true
            );

            performanceMetrics.trackAPICall({
              endpoint: path,
              method: type,
              duration,
              status: 200,
              success: true,
              timestamp: Date.now(),
            });

            observer.next(value);
          },
          error(err) {
            const duration = Date.now() - startTime;
            const status = err.data?.httpStatus || 500;

            // Track failed API call
            metricsCollector.trackAPICall(
              path,
              type.toUpperCase(),
              duration,
              status,
              false
            );

            performanceMetrics.trackAPICall({
              endpoint: path,
              method: type,
              duration,
              status,
              success: false,
              timestamp: Date.now(),
            });

            // Track error
            metricsCollector.trackError(
              `tRPC Error: ${path}`,
              'medium',
              {
                path,
                type,
                code: err.data?.code,
                httpStatus: status,
              },
              err.message
            );

            observer.error(err);
          },
          complete() {
            observer.complete();
          },
        });

        return unsubscribe;
      });
    };
  };
}

