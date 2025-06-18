'use client';

import React from 'react';
import { Card, Button, Dropdown, Typography, Tag, Space } from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Form } from '@/types';

const { Text, Paragraph } = Typography;

interface FormCardProps {
  form: Form;
  onEdit: (form: Form) => void;
  onDelete: (formId: string) => void;
  onPreview: (form: Form) => void;
  onToggleStatus: (formId: string, isActive: boolean) => void;
  onCopyLink: (link: string) => void;
  onViewResponses: (formId: string) => void;
  responsesCount?: number;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  onEdit,
  onDelete,
  onPreview,
  onToggleStatus,
  onCopyLink,
  onViewResponses,
  responsesCount = 0
}) => {
  const menuItems = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit Form',
      onClick: () => onEdit(form)
    },
    {
      key: 'preview',
      icon: <EyeOutlined />,
      label: 'Preview Form',
      onClick: () => onPreview(form)
    },
    {
      key: 'copy-link',
      icon: <LinkOutlined />,
      label: 'Copy Shareable Link',
      onClick: () => onCopyLink(form.shareableLink)
    },
    {
      key: 'toggle-status',
      icon: form.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />,
      label: form.isActive ? 'Deactivate Form' : 'Activate Form',
      onClick: () => onToggleStatus(form.id, !form.isActive)
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete Form',
      danger: true,
      onClick: () => onDelete(form.id)
    }
  ];

  return (
    <Card
      className="h-full hover:shadow-lg transition-shadow duration-200"
      actions={[
        <Button
          key="responses"
          type="link"
          icon={<BarChartOutlined />}
          onClick={() => onViewResponses(form.id)}
        >
          Responses ({responsesCount})
        </Button>,
        <Button
          key="copy"
          type="link"
          icon={<LinkOutlined />}
          onClick={() => onCopyLink(form.shareableLink)}
        >
          Copy Link
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
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {form.title}
            </h3>
            <Tag color={form.isActive ? 'green' : 'red'} className="ml-2">
              {form.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>
          
          {form.description && (
            <Paragraph
              ellipsis={{ rows: 2, expandable: false }}
              className="text-gray-600 mb-3"
            >
              {form.description}
            </Paragraph>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Space>
              <Tag>{form.questions.length} Questions</Tag>
              <Tag color="blue">{responsesCount} Responses</Tag>
            </Space>
          </div>
          
          <Text type="secondary" className="text-xs block">
            Created {form.createdAt.toLocaleDateString()}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default FormCard;