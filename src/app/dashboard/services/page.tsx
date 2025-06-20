"use client";

import React, { useState } from 'react';
import { Button, Row, Col, Empty, Input, Select, message } from 'antd';
import { Plus, Search } from 'lucide-react';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceForm from '@/components/services/ServiceForm';
import { mockServices } from '@/data/mockData';
import { Service } from '@/types';
import {useRouter} from "next/navigation";

const Services: React.FC = () => {
    const route = useRouter();
    const [services, setServices] = useState<Service[]>(mockServices);
    const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editingService, setEditingService] = useState<Service | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');

    React.useEffect(() => {
        const filtered = services.filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );

        // Sort services
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

    const handleCreateService = () => {
        setEditingService(undefined);
        setShowServiceForm(true);
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setShowServiceForm(true);
    };

    const handleDeleteService = (serviceId: string) => {
        setServices(services.filter(s => s.id !== serviceId));
        message.success('Service deleted successfully');
    };

    const handleViewForms = (serviceId: string) => {
        route.push(`/forms?serviceId=${serviceId}`);
    };

    const handleServiceSubmit = (values: Partial<Service>) => {
        if (editingService) {
            // Update existing service
            setServices(services.map(s =>
                s.id === editingService.id
                    ? { ...s, ...values }
                    : s
            ));
            message.success('Service updated successfully');
        } else {
            // Create new service
            const newService: Service = {
                id: Date.now().toString(),
                name: values.name!,
                description: values.description,
                createdAt: new Date(),
                formsCount: 0,
                responsesCount: 0,
            };
            setServices([...services, newService]);
            message.success('Service created successfully');
        }
        setShowServiceForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your services and their review forms
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={handleCreateService}
                    size="large"
                >
                    Create Service
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search services..."
                    prefix={<Search size={16} className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sm:w-80"
                    size="large"
                />
                <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="sm:w-48"
                    size="large"
                >
                    <Select.Option value="name">Sort by Name</Select.Option>
                    <Select.Option value="created">Sort by Created Date</Select.Option>
                    <Select.Option value="responses">Sort by Responses</Select.Option>
                    <Select.Option value="forms">Sort by Forms Count</Select.Option>
                </Select>
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {filteredServices.map((service) => (
                        <Col key={service.id} xs={24} sm={12} lg={8} xl={6}>
                            <ServiceCard
                                service={service}
                                onEdit={handleEditService}
                                onDelete={handleDeleteService}
                                onViewForms={handleViewForms}
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-12">
                    <Empty
                        description={
                            searchTerm
                                ? `No services found matching "${searchTerm}"`
                                : "No services created yet"
                        }
                    >
                        {!searchTerm && (
                            <Button
                                type="primary"
                                icon={<Plus size={16} />}
                                onClick={handleCreateService}
                                size="large"
                            >
                                Create Your First Service
                            </Button>
                        )}
                    </Empty>
                </div>
            )}

            {/* Service Form Modal */}
            <ServiceForm
                visible={showServiceForm}
                onCancel={() => setShowServiceForm(false)}
                onSubmit={handleServiceSubmit}
                service={editingService}
            />
        </div>
    );
};

export default Services;