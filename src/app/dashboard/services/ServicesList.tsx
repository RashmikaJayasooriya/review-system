"use client";

import { useMemo } from 'react';
import { Row, Col, Empty } from 'antd';
import { useRouter } from 'next/navigation';
import { useSearchSort } from './SearchSortContext';
import ServiceCard from '@/components/services/ServiceCard';

type ServiceDTO = {
    id: string;
    name: string;
    description: string;
    createdAt: string;          // still string here
    responsesCount: number;
    formsCount: number;
};

interface Props {
    initialServices: ServiceDTO[];
}

export default function ServicesList({ initialServices }: Props) {
    const { searchTerm, sortBy } = useSearchSort();
    const router = useRouter();

    const services = useMemo(() => {
        const withDates = initialServices.map((s) => ({
            ...s,
            createdAt: new Date(s.createdAt),
        }));

        const filtered = withDates.filter(
            (s) =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
        );

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'created':
                    // createdAt is Date again, safe to compare
                    return b.createdAt.getTime() - a.createdAt.getTime();
                case 'responses':
                    return b.responsesCount - a.responsesCount;
                case 'forms':
                    return b.formsCount - a.formsCount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [initialServices, searchTerm, sortBy]);

    const handleViewForms = (id: string) => router.push(`/forms?serviceId=${id}`);

    if (services.length === 0) {
        return (
            <Empty
                className="my-20"
                description={
                    searchTerm
                        ? `No services found matching “${searchTerm}”`
                        : 'No services created yet'
                }
            />
        );
    }

    return (
        <Row gutter={[24, 24]}>
            {services.map((s) => (
                <Col key={s.id} xs={24} sm={12} lg={8} xl={6}>
                    <ServiceCard
                        service={s}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onViewForms={handleViewForms}
                    />
                </Col>
            ))}
        </Row>
    );
}
