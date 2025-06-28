"use client";

import React, {useEffect, useState} from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Button, Tag } from 'antd';
import {
    TrendingUp,
    Users,
    FileText,
    MessageSquare,
    ArrowRight,
    Clock
} from 'lucide-react';
import { mockServices, mockForms, mockResponses } from '@/data/mockData';
import {useRouter} from "next/navigation";

type Service = {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    formsCount: number;
    responsesCount: number;
    responseRate: number;
};


const Dashboard: React.FC = () => {
    const router = useRouter();

    const totalForms = mockForms.length;
    const totalResponses = mockResponses.length;

    const recentResponses = mockResponses
        .map((r) => {
            const responses = r.responses as unknown as Record<string, string>;
            return {
                id: r.id,
                name: responses['default_name'] ?? 'Anonymous',
                comment: responses['q2'] ?? '',
                submittedAt: r.submittedAt,
            };
        })
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

    const [topServices, setTopServices] = useState<Service[]>([]);

    // 👇 Fix: move all calculations to the client side
    useEffect(() => {
        const services = mockServices
            .map((service) => ({
                ...service,
                responseRate: 120, // Static or mock value; not randomized
            }))
            .sort((a, b) => b.responsesCount - a.responsesCount);
        setTopServices(services);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back! Here&#39;s what&#39;s happening with your services.
                    </p>
                </div>
                <Button type="primary" onClick={() => router.push('/dashboard/services')}>
                    View All Services
                </Button>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Total Review Forms"
                            value={totalForms}
                            prefix={<MessageSquare className="text-green-500" size={20} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <div className="text-xs text-gray-500 mt-2">
                            <TrendingUp size={12} className="inline mr-1" />
                            +2 this month
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Total Responses"
                            value={totalResponses}
                            prefix={<Users className="text-purple-500" size={20} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                        <div className="text-xs text-gray-500 mt-2">
                            <TrendingUp size={12} className="inline mr-1" />
                            +12 today
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Top Performing Services */}
                <Col xs={24} lg={12}>
                    <Card
                        title="Top Performing Services"
                        className="h-full"
                        extra={
                            <Button type="link" onClick={() => router.push('/dashboard/services')}>
                                View All <ArrowRight size={14} />
                            </Button>
                        }
                    >
                        <div className="space-y-4">
                            {topServices.slice(0, 3).map((service) => (
                                <div key={service.id} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                                        <Tag color="blue">{service.responsesCount} responses</Tag>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                            <span>Response Rate</span>
                                            <span>{service.responseRate}%</span>
                                        </div>
                                        <Progress
                                            percent={service.responseRate}
                                            size="small"
                                            strokeColor={service.responseRate > 80 ? '#52c41a' : service.responseRate > 60 ? '#faad14' : '#ff4d4f'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* Recent Responses */}
                <Col xs={24} lg={12}>
                    <Card
                        title="Recent Responses"
                        className="h-full"
                        extra={
                            <Button type="link" onClick={() => router.push('/dashboard/responses')}>
                                View All <ArrowRight size={14} />
                            </Button>
                        }
                    >
                        <List
                            dataSource={recentResponses}
                            renderItem={(item) => (
                                <List.Item className="px-0">
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar className="bg-green-500">
                                                <MessageSquare size={16} />
                                            </Avatar>
                                        }
                                        title={
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                                                    {item.submittedAt.toLocaleDateString()}
                                                </span>
                                            </div>
                                        }
                                        description={item.comment}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Button
                            type="dashed"
                            block
                            size="large"
                            onClick={() => router.push('/dashboard/services')}
                        >
                            <FileText size={24} className="mb-2" />
                            <span>Create Service</span>
                        </Button>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Button
                            type="dashed"
                            block
                            size="large"
                            onClick={() => router.push('/dashboard/forms')}
                        >
                            <MessageSquare size={24} className="mb-2" />
                            <span>Create Form</span>
                        </Button>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Button
                            type="dashed"
                            block
                            size="large"
                            onClick={() => router.push('/dashboard/responses')}
                        >
                            <Users size={24} className="mb-2" />
                            <span>View Responses</span>
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Dashboard;