"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    sortBy: 'name' | 'created' | 'responses' | 'forms';
    setSortBy: (v: 'name' | 'created' | 'responses' | 'forms') => void;
}

const SearchSortContext = createContext<Ctx | null>(null);

export function useSearchSort() {
    const ctx = useContext(SearchSortContext);
    if (!ctx) throw new Error('useSearchSort must be used inside <SearchSortProvider>');
    return ctx;
}

export function SearchSortProvider({ children }: { children: ReactNode }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'created' | 'responses' | 'forms'>('name');

    return (
        <SearchSortContext.Provider value={{ searchTerm, setSearchTerm, sortBy, setSortBy }}>
            {children}
        </SearchSortContext.Provider>
    );
}
