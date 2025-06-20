"use client";

import React, { useState } from 'react';
import { Card, Table, Tag, Select, Input, DatePicker, Rate, Button, Space, Avatar } from 'antd';
import { Search, Download, Eye, Filter } from 'lucide-react';
import { mockResponses, mockForms, mockServices } from '@/data/mockData';
import { FormResponse } from '@/types';

const { RangePicker } = DatePicker;

const Responses: React.FC = () => {
    const [responses] = useState<FormResponse[]>(mockResponses);
    const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>(mockResponses);
    const [selectedForm, setSelectedForm] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const getFormTitle = (formId: string) => {
        const form = mockForms.find(f => f.id === formId);
        return form?.title || 'Unknown Form';
    };

    const getServiceName = (formId: string) => {
        const form = mockForms.find(f => f.id === formId);
        if (!form) return 'Unknown Service';
        const service = mockServices.find(s => s.id === form.serviceId);
        return service?.name || 'Unknown Service';
    };

    const columns = [
        {
            title: 'Response ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id: string) => (
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    #{id.slice(-6)}
                </code>
            ),
        },
        {
            title: 'Form',
            dataIndex: 'formId',
            key: 'form',
            render: (formId: string) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {getFormTitle(formId)}
                    </div>
                    <div className="text-xs text-gray-500">
                        {getServiceName(formId)}
                    </div>
                </div>
            ),
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (record: FormResponse) => {
                const customerName = record.responses['default_name'] || 'Anonymous';
                const customerEmail = record.responses['default_email'] || '';
                return (
                    <div className="flex items-center gap-2">
                        <Avatar size="small" className="bg-blue-500">
                            {customerName.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                            <div className="font-medium text-sm">{customerName}</div>
                            <div className="text-xs text-gray-500">{customerEmail}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 120,
            render: (rating: number) => (
                rating ? <Rate disabled defaultValue={rating} className="text-sm" /> : '-'
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            render: () => (
                <Tag color="green">Completed</Tag>
            ),
        },
        {
            title: 'Submitted',
            dataIndex: 'submittedAt',
            key: 'submittedAt',
            width: 150,
            render: (date: Date) => (
                <div>
                    <div className="text-sm">{date.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (record: FormResponse) => (
                <Space>
                    <Button type="text" size="small" icon={<Eye size={14} />}>
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    React.useEffect(() => {
        let filtered = responses;

        if (selectedForm !== 'all') {
            filtered = filtered.filter(response => response.formId === selectedForm);
        }

        if (searchTerm) {
            filtered = filtered.filter(response => {
                const customerName = response.responses['default_name'] || '';
                const customerEmail = response.responses['default_email'] || '';
                return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        setFilteredResponses(filtered);
    }, [responses, selectedForm, searchTerm]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Form Responses</h1>
                    <p className="text-gray-600 mt-1">
                        View and manage all form responses
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<Download size={16} />}
                    size="large"
                >
                    Export Data
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{responses.length}</div>
                    <div className="text-sm text-gray-600">Total Responses</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {responses.filter(r => r.submittedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                    </div>
                    <div className="text-sm text-gray-600">This Week</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">4.6</div>
                    <div className="text-sm text-gray-600">Avg. Rating</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4">
                    <Input
                        placeholder="Search by customer name or email..."
                        prefix={<Search size={16} className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="lg:w-80"
                    />

                    <Select
                        value={selectedForm}
                        onChange={setSelectedForm}
                        className="lg:w-64"
                        placeholder="Filter by form"
                    >
                        <Select.Option value="all">All Forms</Select.Option>
                        {mockForms.map(form => (
                            <Select.Option key={form.id} value={form.id}>
                                {form.title} ({getServiceName(form.id)})
                            </Select.Option>
                        ))}
                    </Select>

                    <RangePicker className="lg:w-64" />

                    <Button icon={<Filter size={16} />}>
                        More Filters
                    </Button>
                </div>
            </Card>

            {/* Responses Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredResponses}
                    rowKey="id"
                    pagination={{
                        total: filteredResponses.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} responses`,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};

export default Responses;