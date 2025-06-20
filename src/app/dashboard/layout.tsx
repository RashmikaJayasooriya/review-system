"use client";

import React, { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import {ConfigProvider, Layout} from 'antd';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


const { Content } = Layout;
const theme = {
    token: {
        colorPrimary: '#1890ff',
        borderRadius: 8,
        wireframe: false,
    },
    components: {
        Layout: {
            siderBg: '#ffffff',
            triggerBg: '#1890ff',
        },
        Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#e6f7ff',
            itemSelectedColor: '#1890ff',
            itemHoverBg: '#f0f9ff',
        },
    },
};

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {

    const [collapsed, setCollapsed] = useState(false);

    return (
        <ConfigProvider theme={theme}>
        <Layout className="h-screen bg-gray-50">
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout className="transition-all duration-200">
                <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
                <Content className="p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
        </ConfigProvider>
    );
}
