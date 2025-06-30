import '@ant-design/v5-patch-for-react-19';
import "./globals.css";
import { ConfigProvider, App as AntdApp } from 'antd';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 6,
            },
          }}
        >
            <AntdApp>
                {children}
            </AntdApp>
        </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}