"use client";

import React, {useState} from 'react';
import {ConfigProvider, Layout} from 'antd';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {SessionProvider} from 'next-auth/react';


const {Content} = Layout;
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
        <SessionProvider>
            <ConfigProvider theme={theme}>
                <Layout className="h-screen bg-gray-50">
                    <Sidebar collapsed={collapsed} onCollapse={setCollapsed}/>
                    <Layout className="transition-all duration-200">
                        <Header onToggle={() => setCollapsed(!collapsed)}/>
                        <Content className="p-6 bg-gray-50">
                            <div className="max-w-7xl mx-auto">
                                {children}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </SessionProvider>
    );
}
