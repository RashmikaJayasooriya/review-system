'use client';

import React from 'react';
import { Card, Button, Dropdown, Typography, Tag } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Service } from '@/types';

const { Text, Paragraph } = Typography;

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onViewForms: (serviceId: string) => void;
  formsCount?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  onViewForms,
  formsCount = 0
}) => {
  const menuItems = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit Service',
      onClick: () => onEdit(service)
    },
    {
      key: 'forms',
      icon: <FormOutlined />,
      label: 'View Forms',
      onClick: () => onViewForms(service.id)
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete Service',
      danger: true,
      onClick: () => onDelete(service.id)
    }
  ];

  return (
    <Card
      className="h-full hover:shadow-lg transition-shadow duration-200"
      actions={[
        <Button
          key="forms"
          type="link"
          icon={<FormOutlined />}
          onClick={() => onViewForms(service.id)}
        >
          View Forms ({formsCount})
        </Button>
      ]}
      extra={
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      }
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {service.name}
          </h3>
          {service.description && (
            <Paragraph
              ellipsis={{ rows: 2, expandable: false }}
              className="text-gray-600 mb-3"
            >
              {service.description}
            </Paragraph>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Tag color="blue">{formsCount} Forms</Tag>
          <Text type="secondary" className="text-xs">
            Created {service.createdAt.toLocaleDateString()}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;