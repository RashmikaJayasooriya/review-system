import { Suspense } from 'react';
import { SearchFilterProvider } from './SearchContext';
import ResponsesHeader from './ResponsesHeader';
import ResponsesWrapper from './ResponsesWrapper';
import { getForms } from '../forms/actions';

export default async function ResponsesPage() {
    const raw = await getForms();
    const forms = raw.map(f => ({ id: f.id, title: f.title }));
    return (
        <SearchFilterProvider>
            <ResponsesHeader forms={forms} />
            <Suspense fallback={<div>Loading...</div>}>
                <ResponsesWrapper />
            </Suspense>
        </SearchFilterProvider>
    );
};