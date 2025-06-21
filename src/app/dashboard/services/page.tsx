import { Suspense } from 'react';
import { SearchSortProvider } from './SearchSortContext';
import ServicesHeader from './ServicesHeader';
import ServicesSkeleton from "@/components/services/ServicesSkeleton";
import ServicesListWrapper from "@/app/dashboard/services/ServicesWrapper";

export default function ServicesPage() {
    return (
        <SearchSortProvider>
            <ServicesHeader />
            <Suspense fallback={<ServicesSkeleton />}>
                <ServicesListWrapper />
            </Suspense>
        </SearchSortProvider>
    );
}
