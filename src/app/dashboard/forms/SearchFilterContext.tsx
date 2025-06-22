"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    serviceId: string;
    setServiceId: (v: string) => void;
    status: 'all' | 'active' | 'inactive';
    setStatus: (v: 'all' | 'active' | 'inactive') => void;
}

const Ctx = createContext<Ctx | null>(null);

export function useSearchFilter() {
    const c = useContext(Ctx);
    if (!c) throw new Error('useSearchFilter must be used inside provider');
    return c;
}

export function SearchFilterProvider({ children }: { children: ReactNode }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceId, setServiceId] = useState('all');
    const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

    return (
        <Ctx.Provider value={{ searchTerm, setSearchTerm, serviceId, setServiceId, status, setStatus }}>
            {children}
        </Ctx.Provider>
    );
}