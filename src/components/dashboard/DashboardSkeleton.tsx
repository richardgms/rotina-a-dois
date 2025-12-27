import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/PageContainer";

export function DashboardSkeleton() {
    return (
        <PageContainer className="flex flex-col h-[calc(100vh-8rem)] !p-0 md:!p-6">
            {/* Sticky Header Skeleton */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b flex flex-col items-center mb-0 md:border-none md:static">
                <div className="flex items-center justify-between w-full max-w-xs mb-1">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto w-full px-4 pt-6 md:px-0">
                {/* Status Section */}
                <div className="flex flex-col items-center justify-center gap-4 mb-6">
                    <Skeleton className="h-8 w-48 rounded-full" />
                </div>

                {/* Progress Bar */}
                <div className="mb-6 space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                </div>

                {/* Task List */}
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-3 items-start p-3 border-[0.5px] rounded-xl bg-card/10">
                            <Skeleton className="h-5 w-5 rounded-full mt-1 shrink-0 opacity-40" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4 opacity-40" />
                                <Skeleton className="h-3 w-1/2 opacity-40" />
                                <div className="flex gap-2 pt-1">
                                    <Skeleton className="h-5 w-16 rounded-full opacity-40" />
                                    <Skeleton className="h-5 w-16 rounded-full opacity-40" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
