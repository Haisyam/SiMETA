export default function TaskSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="glass-card animate-pulse space-y-4">
          <div className="h-4 w-2/3 rounded-full bg-white/10" />
          <div className="h-3 w-1/3 rounded-full bg-white/10" />
          <div className="flex gap-3">
            <div className="h-8 flex-1 rounded-xl bg-white/10" />
            <div className="h-8 w-16 rounded-xl bg-white/10" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 flex-1 rounded-xl bg-white/10" />
            <div className="h-8 w-12 rounded-xl bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
