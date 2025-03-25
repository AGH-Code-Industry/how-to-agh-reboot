export const MESSAGE_STYLES = {
  success: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  error: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
} as const;

export type MessageType = keyof typeof MESSAGE_STYLES;
