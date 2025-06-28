"use client";
import { Table } from 'antd';
import { useMemo } from 'react';
import { useSearchFilter } from './SearchContext';

interface ReviewDTO {
    id: string;
    formId: string;
    formTitle: string;
    serviceName: string;
    review: string;
    name: string;
    email: string;
    createdAt: string; // ISO string
}

interface Props {
    initialReviews: ReviewDTO[];
}

export default function ResponsesList({ initialReviews }: Props) {
    const { searchTerm, formId } = useSearchFilter();

    const reviews = useMemo(() => {
        const withDate = initialReviews.map(r => ({ ...r, createdAt: new Date(r.createdAt) }));
        let filtered = withDate;
        if (formId !== 'all') {
            filtered = filtered.filter(r => r.formId === formId);
        }
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.review.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [initialReviews, searchTerm, formId]);

    const columns = [
        {
            title: '#',
            dataIndex: 'No',
            key: 'No',
            render: (_: any, __: any, index: number) => index + 1,
            width: 50,
        },
        {
            title: 'Service',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: (serviceName: string) => <span className="font-semibold">{serviceName}</span>,
            width: 120,
        },
        {
            title: 'Form',
            dataIndex: 'formTitle',
            key: 'formTitle',
            width: 210,
        },
        {
            title: 'Customer',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Review',
            dataIndex: 'review',
            key: 'review',
        },
        {
            title: 'Submitted',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d: Date) => d.toLocaleString(),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={reviews}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ y: 400 }}
        />
    );
}