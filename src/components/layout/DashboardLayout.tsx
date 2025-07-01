'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Input, Button, Badge } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  FormOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined
} from '@ant-design/icons';
import {useSession} from "next-auth/react";
import {User} from "lucide-react";

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeKey?: string;
  onMenuSelect?: (key: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeKey = 'dashboard',
  onMenuSelect 
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { data: session } = useSession();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'services',
      icon: <AppstoreOutlined />,
      label: 'Services',
    },
    {
      key: 'forms',
      icon: <FormOutlined />,
      label: 'Review Forms',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    onMenuSelect?.(e.key);
    if (window.innerWidth < 768) {
      setMobileMenuVisible(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="hidden md:block fixed left-0 top-0 bottom-0 z-10"
        theme="light"
        width={250}
        collapsedWidth={80}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <div className="text-xl font-bold ">
            {collapsed ? 'RS' : 'ReviewSystem'}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
        />
      </Sider>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-0 z-50 ${mobileMenuVisible ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuVisible(false)} />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-white">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <div className="text-xl font-bold ">ReviewSystem</div>
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-r-0"
          />
        </div>
      </div>

      <Layout className="md:ml-64">
        <Header className="bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex"
            />
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className="md:hidden"
            />
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              className="w-64 hidden sm:block"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <Avatar src={session?.user?.image ?? <User/>} size="small" />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{session?.user?.name}</div>
                  <div className="text-xs text-gray-500">{session?.user?.email}</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;