"use client";
import { Card, Row, Col } from 'antd';
import StatsCard from './StatsCard';

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Row gutter={[16,16]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatsCard title="" value={0} loading />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatsCard title="" value={0} loading />
                </Col>
            </Row>
            <Row gutter={[16,16]}>
                <Col xs={24} lg={12}>
                    <Card className="h-64" loading />
                </Col>
                <Col xs={24} lg={12}>
                    <Card className="h-64" loading />
                </Col>
            </Row>
            <Card loading className="h-40" />
        </div>
    );
}