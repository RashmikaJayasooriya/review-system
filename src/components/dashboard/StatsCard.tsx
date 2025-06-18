'use client';

import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  loading = false
}) => {
  return (
    <Card loading={loading} className="hover:shadow-md transition-shadow">
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color: '#1890ff' }}
      />
      {trend && (
        <div className="mt-2 flex items-center">
          {trend.isPositive ? (
            <ArrowUpOutlined className="text-green-500 mr-1" />
          ) : (
            <ArrowDownOutlined className="text-red-500 mr-1" />
          )}
          <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;