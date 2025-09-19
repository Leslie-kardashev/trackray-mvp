
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DriverDashboard from './page-wrapper';

export default function DriverDashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DriverDashboard />
        </Suspense>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1 w-full">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
}
