'use client';
import {Button, Input, Select} from 'antd';
import {Plus, Search, Filter} from 'lucide-react';
import {useState} from 'react';
import {useSearchFilter} from './SearchFilterContext';
import CreateFormModal from '@/components/forms/CreateFormModal';
import ServiceSelect from "@/components/forms/ServiceSelect";

interface ServiceOption {
    id: string;
    name: string;
}

interface FormsHeaderProps {
    services: ServiceOption[]
}

export default function FormsHeader({services}: FormsHeaderProps) {
    const {searchTerm, setSearchTerm, serviceId, status, setStatus} = useSearchFilter();
    const [showModal, setShowModal] = useState(false);
    const [modalKey, setModalKey] = useState(0);

    const openModal = () => {
        setModalKey(k => k + 1);
        setShowModal(true);
    };

    return (
        <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Review Forms</h1>
                    <p className="text-gray-600 mt-1">Create and manage feedback forms for your services</p>
                </div>
                <Button type="primary" icon={<Plus size={16}/>} onClick={openModal} size="large"
                        disabled={serviceId === 'all'}>
                    Create Form
                </Button>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <Input
                    placeholder="Search forms…"
                    prefix={<Search size={16} className="text-gray-400"/>}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="lg:w-80"
                    size="large"
                    allowClear
                />
                <ServiceSelect
                    services={services}
                />
                <Select
                    value={status}
                    onChange={v => setStatus(v)}
                    className="lg:w-48"
                    size="large"
                    prefix={<Filter size={16}/>}
                >
                    <Select.Option value="all">All Status</Select.Option>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
            </div>
            <CreateFormModal key={modalKey} open={showModal} serviceId={serviceId} onClose={() => setShowModal(false)}/>
        </div>
    );
}