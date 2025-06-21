"use client";

import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Empty, Input, Select, message } from 'antd';
import { Plus, Search } from 'lucide-react';
import ServiceCard from '@/components/services/ServiceCard';
import CreateServiceModal from '@/components/services/CreateServiceModal';
import { Service } from '@/types';
import { useRouter } from 'next/navigation';
import { getServices } from './actions';

interface Props {
    initialServices: Service[];
}

const ServicesClient: React.FC<Props> = ({ initialServices }) => {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>(initialServices);
    const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');

    useEffect(() => {
        const filtered = services.filter((service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'created':
                    return b.createdAt.getTime() - a.createdAt.getTime();
                case 'responses':
                    return b.responsesCount - a.responsesCount;
                case 'forms':
                    return b.formsCount - a.formsCount;
                default:
                    return 0;
            }
        });

        setFilteredServices(filtered);
    }, [services, searchTerm, sortBy]);

    const reloadServices = async () => {
        const latest = await getServices();
        setServices(latest);
    };

    const handleServiceCreated = async () => {
        setShowModal(false);
        await reloadServices();
        message.success('Service created successfully');
    };

    const handleViewForms = (serviceId: string) => {
        router.push(`/forms?serviceId=${serviceId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-600 mt-1">Manage your services and their review forms</p>
                </div>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => setShowModal(true)} size="large">
                    Create Service
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search services..."
                    prefix={<Search size={16} className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sm:w-80"
                    size="large"
                />
                <Select value={sortBy} onChange={setSortBy} className="sm:w-48" size="large">
                    <Select.Option value="name">Sort by Name</Select.Option>
                    <Select.Option value="created">Sort by Created Date</Select.Option>
                    <Select.Option value="responses">Sort by Responses</Select.Option>
                    <Select.Option value="forms">Sort by Forms Count</Select.Option>
                </Select>
            </div>

            {filteredServices.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {filteredServices.map((service) => (
                        <Col key={service.id} xs={24} sm={12} lg={8} xl={6}>
                            <ServiceCard service={service} onEdit={() => {}} onDelete={() => {}} onViewForms={handleViewForms} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-12">
                    <Empty
                        description={
                            searchTerm ? `No services found matching "${searchTerm}"` : 'No services created yet'
                        }
                    >
                        {!searchTerm && (
                            <Button type="primary" icon={<Plus size={16} />} onClick={() => setShowModal(true)} size="large">
                                Create Your First Service
                            </Button>
                        )}
                    </Empty>
                </div>
            )}

            <CreateServiceModal open={showModal} onClose={() => setShowModal(false)} onSuccess={handleServiceCreated} />
        </div>
    );
};

export default ServicesClient;