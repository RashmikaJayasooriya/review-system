import { Suspense } from 'react';
import DashboardWrapper from './DashboardWrapper';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardWrapper />
        </Suspense>
    );
}