import { Skeleton } from "@/components/ui/skeleton";

export function MonthSkeleton() {
    const weekDays = Array(7).fill(null);
    const days = Array(35).fill(null); // Grid 7x5 typical month view

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Sticky Header Skeleton */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b flex flex-col items-center mb-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static">
                <div className="flex items-center justify-between w-full max-w-xs mb-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-6 w-32 mt-1" />
            </div>

            <div className="flex-1 w-full max-w-sm mx-auto mt-4 px-4 md:px-0">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((_, i) => (
                        <div key={i} className="flex justify-center py-2">
                            <Skeleton className="h-3 w-4" />
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-full" />
                    ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-8 mb-4 opacity-50">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <Skeleton className="h-2 w-2 rounded-full" />
                            <Skeleton className="h-2 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
