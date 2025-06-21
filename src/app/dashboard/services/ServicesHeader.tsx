'use client';

import { Button, Input, Select } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import CreateServiceModal from '@/components/services/CreateServiceModal';
import { useSearchSort } from './SearchSortContext';

export default function ServicesHeader() {
    const { searchTerm, setSearchTerm, sortBy, setSortBy } = useSearchSort();
    const [showModal, setShowModal] = useState(false);
    const [modalKey, setModalKey] = useState(0);

    const openModal = () => {
        setModalKey((k) => k + 1); // force new instance
        setShowModal(true);
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Heading + CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-600 mt-1">Manage your services and their review forms</p>
                </div>

                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={openModal}
                    size="large"
                >
                    Create Service
                </Button>
            </div>

            {/* Search + sort */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search services…"
                    prefix={<Search size={16} className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sm:w-80"
                    size="large"
                    allowClear
                />

                <Select
                    value={sortBy}
                    onChange={(v) => setSortBy(v)}
                    className="sm:w-48"
                    size="large"
                >
                    <Select.Option value="name">Sort by Name</Select.Option>
                    <Select.Option value="created">Sort by Created Date</Select.Option>
                    <Select.Option value="responses">Sort by Responses</Select.Option>
                    <Select.Option value="forms">Sort by Forms Count</Select.Option>
                </Select>
            </div>

            {/* Modal */}
            <CreateServiceModal
                key={modalKey}
                open={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => setShowModal(false)} // re-load list there if you like
            />
        </div>
    );
}
