import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/PageContainer";

export function DashboardSkeleton() {
    return (
        <PageContainer>
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>

            <div className="flex justify-center gap-4 mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
            </div>

            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
            </div>

            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        </PageContainer>
    );
}
