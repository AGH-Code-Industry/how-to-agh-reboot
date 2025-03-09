import { cn } from '@/lib/utils';

type ScreenOverlayProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ScreenOverlay({ children, className }: ScreenOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 mb-16 flex items-start justify-center bg-background/50 p-4 backdrop-blur-md',
        className
      )}
    >
      {children}
    </div>
  );
}
