"use client";

import { useMemo, useState, useEffect } from 'react';
import { Row, Col, Empty, App as AntdApp } from 'antd';
import { useRouter } from 'next/navigation';
import { useSearchSort } from './SearchSortContext';
import ServiceCard from '@/components/services/ServiceCard';
import EditServiceModal from '@/components/services/EditServiceModal';
import { deleteService, getServices } from '@/app/dashboard/services/actions';

type ServiceDTO = {
    userId: string;
    id: string;
    name: string;
    description: string;
    googleReviewLink?: string;
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
    const { modal, message } = AntdApp.useApp();

    const [services, setServices] = useState<ServiceDTO[]>(initialServices);
    const [editingService, setEditingService] = useState<ServiceDTO | null>(null);
    const [showEdit, setShowEdit] = useState(false);
    const [modalKey, setModalKey] = useState(0);

    useEffect(() => {
        setServices(initialServices);
    }, [initialServices]);

    const servicesToDisplay = useMemo(() => {
        const withDates = services.map((s) => ({
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
    }, [services, searchTerm, sortBy]);

    const handleViewForms = (id: string) => router.push(`/forms?serviceId=${id}`);

    const reloadServices = async () => {
        const latest = await getServices();
        const dto: ServiceDTO[] = latest.map((s) => ({
            userId: s.userId,
            id: s.id,
            name: s.name,
            description: s.description ?? '',
            googleReviewLink: s.googleReviewLink,
            createdAt: s.createdAt.toISOString(),
            responsesCount: s.responsesCount,
            formsCount: s.formsCount,
        }));
        setServices(dto);
        setModalKey((k) => k + 1);
    };

    const handleEdit = (service: ServiceDTO) => {
        setEditingService(service);
        setShowEdit(true);
    };

    const handleDelete = (id: string) => {
        modal.confirm({
            title: 'Delete service?',
            content: 'This action cannot be undone.',
            okText: 'Delete',
            okButtonProps: { danger: true },
            async onOk() {
                try {
                    await deleteService(id);
                    await reloadServices();
                    message.success('Service deleted');
                } catch {
                    message.error('Failed to delete service');
                }
            },
        });
    };

    if (servicesToDisplay.length === 0) {
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
        <>
        <Row gutter={[24, 24]}>
            {servicesToDisplay.map((s) => (
                <Col key={s.id} xs={24} sm={12} lg={8} xl={6}>
                    <ServiceCard
                        service={{...s, createdAt: s.createdAt.toLocaleDateString() }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewForms={handleViewForms}
                    />
                </Col>
            ))}
        </Row>
            <EditServiceModal
                key={modalKey}
                open={showEdit}
                service={editingService ? { ...editingService, createdAt: new Date(editingService.createdAt) } : null}
                onClose={() => {
                    setShowEdit(false);
                    reloadServices();
                }}
            />
        </>
    );
}
