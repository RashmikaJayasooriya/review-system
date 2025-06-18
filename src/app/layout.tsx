import "./globals.css";
import { ConfigProvider } from 'antd';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 6,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}