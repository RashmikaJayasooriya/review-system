import { Suspense } from 'react';
import { SearchFilterProvider } from './SearchFilterContext';
import FormsHeader from './FormsHeader';
import FormsSkeleton from '@/components/forms/FormsSkeleton';
import FormsWrapper from './FormsWrapper';
import {getServices} from "@/app/dashboard/services/actions";

export default async function FormsPage() {
    const raw = await getServices();
    const services = raw.map((s) => ({ id: s.id, name: s.name }));

    return (
        <SearchFilterProvider>
            <FormsHeader services={services}/>
            <Suspense fallback={<FormsSkeleton />}>
                <FormsWrapper />
            </Suspense>
        </SearchFilterProvider>
    );
}