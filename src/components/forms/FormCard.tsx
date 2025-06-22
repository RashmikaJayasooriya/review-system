import React from 'react';
import { Card, Button, Tag, Dropdown, Space, Tooltip } from 'antd';
import {
  MoreVertical,
  Eye,
  Edit,
  Share2,
  BarChart3,
  Copy,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import type { MenuProps } from 'antd';
import { ReviewForm } from '@/types';

interface FormCardProps {
  form: ReviewForm;
  onEdit: (form: ReviewForm) => void;
  onPreview: (form: ReviewForm) => void;
  onDelete: (formId: string) => void;
  onViewResponses: (formId: string) => void;
  onToggleStatus: (formId: string, isActive: boolean) => void;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  onEdit,onPreview,
  onDelete,
  onViewResponses,
  onToggleStatus,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(form.shareableLink);
    // message.success('Form link copied to clipboard!');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'preview',
      icon: <Eye size={16} />,
      label: 'Preview Form',
      onClick: () => onPreview(form),
    },
    {
      key: 'edit',
      icon: <Edit size={16} />,
      label: 'Edit Form',
      onClick: () => onEdit(form),
    },
    {
      key: 'share',
      icon: <Share2 size={16} />,
      label: 'Share Form',
    },
    {
      key: 'copy',
      icon: <Copy size={16} />,
      label: 'Copy Link',
      onClick: handleCopyLink,
    },
    {
      type: 'divider',
    },
    {
      key: 'toggle',
      icon: form.isActive ? <Pause size={16} /> : <Play size={16} />,
      label: form.isActive ? 'Deactivate' : 'Activate',
      onClick: () => onToggleStatus(form.id, !form.isActive),
    },
    {
      key: 'delete',
      icon: <Trash2 size={16} />,
      label: 'Delete Form',
      danger: true,
      onClick: () => onDelete(form.id),
    },
  ];

  return (
    <Card
      className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
      styles={{ body: { padding: 24 } }}
      actions={[
        <Tooltip title="View Responses" key="view-responses">
          <Button
            type="text"
            icon={<BarChart3 size={16} />}
            onClick={() => onViewResponses(form.id)}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Responses</span>
          </Button>
        </Tooltip>,
        <Tooltip title="Share Form" key="share-form">
          <Button
            type="text"
            icon={<Share2 size={16} />}
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Share</span>
          </Button>
        </Tooltip>,
        <Dropdown
            key="more-options"
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreVertical size={16} />}
            className="flex items-center justify-center"
          />
        </Dropdown>,
      ]}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {form.title}
            </h3>
            <Space size="small">
              <Tag color={form.isActive ? 'green' : 'red'} className="text-xs">
                {form.isActive ? 'Active' : 'Inactive'}
              </Tag>
              <Tag color="blue" className="text-xs">
                {form.questions.length} Questions
              </Tag>
            </Space>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {form.description || 'No description provided'}
        </p>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Shareable Link</div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex-1 truncate">
              {form.shareableLink}
            </code>
            <Button
              type="text"
              size="small"
              icon={<Copy size={14} />}
              onClick={handleCopyLink}
              className="flex-shrink-0"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {form.responsesCount}
            </div>
            <div className="text-xs text-gray-500">Responses</div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-500">Created</div>
            <div className="text-sm font-medium text-gray-700">
              {form.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FormCard;