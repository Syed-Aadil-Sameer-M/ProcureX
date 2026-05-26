interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="rounded-md border border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <div className="h-4 bg-slate-700 rounded w-1/4 animate-pulse" />
      </div>
      <div className="divide-y divide-slate-700">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div
                key={j}
                className="h-4 bg-slate-700 rounded animate-pulse"
                style={{
                  width: j === 0 ? '25%' : j === columns - 1 ? '15%' : '20%',
                  animationDelay: `${i * 50 + j * 25}ms`
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}