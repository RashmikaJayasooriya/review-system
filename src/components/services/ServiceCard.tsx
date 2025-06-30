import React from 'react';
import {Card, Button, Tag, Avatar, Dropdown} from 'antd';
import {MoreVertical, FileText, BarChart3, Edit, Trash2} from 'lucide-react';
import type {MenuProps} from 'antd';

interface ServiceCardProps {
    service: {
      userId: string;
      id: string;
      name: string;
      description: string;
      createdAt: string;
      responsesCount: number;
      formsCount: number;
    },
    onDelete: (serviceId: string) => void,
    onViewForms: (serviceId: string) => void,
    onEdit: (service: {
      userId: string;
      id: string;
      name: string;
      description: string;
      createdAt: string;
      responsesCount: number;
      formsCount: number;
    }) => void
}

const ServiceCard: React.FC<ServiceCardProps> = ({
                                                     service,
                                                     onDelete,
                                                     onViewForms,
                                                     onEdit
                                                 }) => {
    const menuItems: MenuProps['items'] = [
        {
            key: 'edit',
            icon: <Edit size={16}/>,
            label: 'Edit Service',
            onClick: () => onEdit(service),
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <Trash2 size={16}/>,
            label: 'Delete Service',
            danger: true,
            onClick: () => onDelete(service.id),
        },
    ];

    return (
        <Card
            className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
            styles={{body: {padding: 24}}}
            actions={[
                <Button
                    key="edit"
                    type="text"
                    icon={<FileText size={16}/>}
                    onClick={() => onViewForms(service.id)}
                    className="flex items-center gap-2"
                >
                    <span className="hidden sm:inline">Forms</span>
                </Button>,
                <Button
                    key="analytics"
                    type="text"
                    icon={<BarChart3 size={16}/>}
                    className="flex items-center gap-2"
                >
                    <span className="hidden sm:inline">Analytics</span>
                </Button>,
                <Dropdown
                    key="more"
                    menu={{items: menuItems}}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<MoreVertical size={16}/>}
                        className="flex items-center justify-center"
                    />
                </Dropdown>,
            ]}
        >
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={50}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
                        >
                            {service.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {service.name}
                            </h3>
                            <Tag color="blue" className="text-xs">
                                Active
                            </Tag>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description || 'No description provided'}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">
                                {service.formsCount}
                            </div>
                            <div className="text-xs text-gray-500">Forms</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">
                                {service.responsesCount}
                            </div>
                            <div className="text-xs text-gray-500">Responses</div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-gray-500">Created</div>
                        <div className="text-sm font-medium text-gray-700">
                            {service.createdAt}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ServiceCard;