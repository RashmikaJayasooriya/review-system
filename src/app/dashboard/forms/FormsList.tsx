'use client';
import { Row, Col, Empty, Tag } from 'antd';
import { useSearchFilter } from './SearchFilterContext';
import FormCard from '@/components/forms/FormCard';
import { ReviewForm } from '@/types';
import { useMemo } from 'react';

interface DTO extends Omit<ReviewForm, 'createdAt'> {
    createdAt: string;
}

interface Props {
    initialForms: DTO[];
}

export default function FormsList({ initialForms }: Props) {
    const { searchTerm, serviceId, status } = useSearchFilter();

    const forms = useMemo(() => {
        const withDate = initialForms.map(f => ({ ...f, createdAt: new Date(f.createdAt) }));
        let filtered = withDate;
        if (serviceId !== 'all') {
            filtered = filtered.filter(f => f.serviceId === serviceId);
        }
        if (searchTerm) {
            filtered = filtered.filter(f =>
                f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (f.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
            );
        }
        if (status !== 'all') {
            filtered = filtered.filter(f => (status === 'active' ? f.isActive : !f.isActive));
        }
        return filtered;
    }, [initialForms, searchTerm, serviceId, status]);

    if (forms.length === 0) {
        return (
            <Empty className="my-20" description={searchTerm ? `No forms found matching “${searchTerm}”` : 'No forms created yet'} />
        );
    }

    return (
        <Row gutter={[24, 24]}>
            {forms.map(f => (
                <Col key={f.id} xs={24} sm={12} lg={8} xl={6}>
                    <div className="space-y-2">
                        <Tag color="blue">Service {f.serviceId}</Tag>
                        <FormCard form={{ ...f, createdAt: new Date(f.createdAt) }} onEdit={() => {}} onDelete={() => {}} onViewResponses={() => {}} onToggleStatus={() => {}} />
                    </div>
                </Col>
            ))}
        </Row>
    );
}