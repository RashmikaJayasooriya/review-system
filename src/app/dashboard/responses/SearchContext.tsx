"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    formId: string;
    setFormId: (v: string) => void;
}

const SearchCtx = createContext<Ctx | null>(null);

export function useSearchFilter() {
    const ctx = useContext(SearchCtx);
    if (!ctx) throw new Error('useSearchFilter must be used within SearchFilterProvider');
    return ctx;
}

export function SearchFilterProvider({ children }: { children: ReactNode }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [formId, setFormId] = useState('all');
    return (
        <SearchCtx.Provider value={{ searchTerm, setSearchTerm, formId, setFormId }}>
            {children}
        </SearchCtx.Provider>
    );
}