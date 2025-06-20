import React from 'react';
import { Layout, Menu } from 'antd';
import {
    LayoutDashboard,
    Settings,
    FileText,
    BarChart3,
    Users,
    Layers
} from 'lucide-react';
import {usePathname, useRouter} from "next/navigation";

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
    const router = useRouter();
    const pathname = usePathname();


    const menuItems = [
        {
            key: '/dashboard/',
            icon: <LayoutDashboard size={18} />,
            label: 'Dashboard',
        },
        {
            key: '/dashboard/services',
            icon: <Layers size={18} />,
            label: 'Services',
        },
        {
            key: '/dashboard/forms',
            icon: <FileText size={18} />,
            label: 'Review Forms',
        },
        {
            key: '/dashboard/responses',
            icon: <BarChart3 size={18} />,
            label: 'Responses',
        },
        {
            key: '/dashboard/customers',
            icon: <Users size={18} />,
            label: 'Customers',
        },
        {
            key: '/dashboard/settings',
            icon: <Settings size={18} />,
            label: 'Settings',
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        router.push(key);
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            className="bg-white shadow-lg border-r border-gray-200"
            width={280}
            collapsedWidth={80}
            breakpoint="lg"
            onBreakpoint={(broken) => {
                if (broken) {
                    onCollapse(true);
                }
            }}
        >
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                    {collapsed ? (
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Layers size={20} className="text-blue-600" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <Layers size={20} className="text-blue-600" />
                            </div>
                            <span className="text-white font-bold text-lg">ReviewHub</span>
                        </div>
                    )}
                </div>

                {/* Menu Section */}
                <div className="flex-1 py-4">
                    <Menu
                        mode="inline"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        className="border-none"
                        style={{
                            backgroundColor: 'transparent',
                        }}
                    />
                </div>

                {/* Footer Section */}
                {!collapsed && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-800 mb-1">
                                Need Help?
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                                Contact our support team
                            </p>
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                Get Support →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Sider>
    );
};

export default Sidebar;