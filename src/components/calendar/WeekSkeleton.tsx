import { Skeleton } from "@/components/ui/skeleton";

export function WeekSkeleton() {
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Sticky Header Skeleton */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b flex flex-col items-center mb-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static">
                <div className="flex items-center justify-between w-full max-w-xs mb-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-6 w-8" />
                    <span className="text-muted-foreground">-</span>
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>

            {/* List/Grid Skeleton */}
            <div className="flex-1 w-full mt-4 md:mt-0">
                <div className="flex flex-col md:grid md:grid-cols-7 gap-3 w-full max-w-4xl mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="flex md:flex-col items-center p-3 md:p-4 gap-4 md:gap-2 border rounded-xl bg-card">
                            {/* Date */}
                            <div className="flex md:flex-col items-baseline md:items-center gap-2 md:gap-0 min-w-[3.5rem] md:min-w-0">
                                <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-md" />
                                <Skeleton className="h-4 w-10 md:h-3 md:w-8 mt-1" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col gap-2 w-full">
                                <Skeleton className="h-2 w-full rounded-full" />
                                <div className="flex justify-between md:hidden">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>

                            {/* Icon */}
                            <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
