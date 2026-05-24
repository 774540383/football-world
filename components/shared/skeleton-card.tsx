import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export function SkeletonCard({ className, lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn("glass-card p-5 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3 w-full" />
      ))}
    </div>
  );
}

export function MatchSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex justify-between">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="skeleton w-14 h-14 rounded-full" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="skeleton h-8 w-20" />
          <div className="skeleton h-3 w-10" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="skeleton w-14 h-14 rounded-full" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <div className="skeleton h-5 w-5" />
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-8" />
          <div className="skeleton h-4 w-8" />
          <div className="skeleton h-4 w-8" />
        </div>
      ))}
    </div>
  );
}
