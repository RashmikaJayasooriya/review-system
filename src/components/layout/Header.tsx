import React, { useState } from 'react';
import { Header as AntHeader } from 'antd/es/layout/layout';
import { Input, Avatar, Dropdown, Badge, Button } from 'antd';
import { Search, Menu, Bell, Settings, LogOut, User } from 'lucide-react';
import type { MenuProps } from 'antd';
import { mockUser} from "@/data/mockData";

interface HeaderProps {
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggle }) => {
  const [searchValue, setSearchValue] = useState('');

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: 'Profile Settings',
    },
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: 'Account Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Sign Out',
      danger: true,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-200 px-4 flex items-center justify-between h-16">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<Menu size={18} />}
          onClick={onToggle}
          className="lg:hidden flex items-center justify-center"
        />
        
        <div className="hidden md:block">
          <Input
            placeholder="Search services, forms..."
            prefix={<Search size={16} className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-80"
            size="middle"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<Bell size={18} />}
            className="flex items-center justify-center"
          />
        </Badge>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <Avatar
              src={mockUser.avatar}
              size={32}
              className="border-2 border-blue-100"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900">
                {mockUser.name}
              </div>
              <div className="text-xs text-gray-500">
                {mockUser.role}
              </div>
            </div>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;