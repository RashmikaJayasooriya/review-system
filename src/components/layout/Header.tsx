import React, {useEffect, useState} from 'react';
import { Header as AntHeader } from 'antd/es/layout/layout';
import {Input, Avatar, Dropdown, Button, AutoComplete} from 'antd';
import { Search, Menu, Settings, LogOut, User } from 'lucide-react';
import type { MenuProps } from 'antd';
import { useSession, signOut } from "next-auth/react";
import {useRouter} from "next/navigation";

const staticRoutes = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Services', path: '/dashboard/services' },
  { label: 'Review Forms', path: '/dashboard/forms' },
  { label: 'Responses', path: '/dashboard/responses' },
];

interface HeaderProps {
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggle }) => {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(async () => {
      const query = searchValue.trim();
      if (!query) {
        setOptions([]);
        return;
      }

      const routeMatches = staticRoutes
          .filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
          .map((r) => ({ value: r.path, label: r.label }));

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = res.ok ? await res.json() : [];
        const apiOptions = (data as { label: string; path: string }[]).map((o) => ({
          value: o.path,
          label: o.label,
        }));
        setOptions([...routeMatches, ...apiOptions]);
      } catch (err) {
        console.error(err);
        setOptions(routeMatches);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const handleSelect = (value: string) => {
    router.push(value);
    setSearchValue('');
    setOptions([]);
  };

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
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Sign Out',
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') signOut();
  };

  return (
      <AntHeader
          style={{ backgroundColor: "#ffffff" }}
          className="bg-white shadow-sm border-b border-gray-200 px-4 flex items-center justify-between h-16"
      >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<Menu size={18} />}
          onClick={onToggle}
          className="lg:hidden flex items-center justify-center"
        />
        
        <div className="hidden md:block">
          <AutoComplete
            value={searchValue}
            options={options}
            onSelect={handleSelect}
            onChange={(v) => setSearchValue(v)}
            className="w-80"
          >
            <Input
                placeholder="Search services, forms..."
                prefix={<Search size={16} className="text-gray-400" />}
                size="middle"
            />
          </AutoComplete>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-colors">
            <Avatar
                src={session?.user?.image ?? <User/>}
              size={30}
                style={{ backgroundColor: '#353030' }}
            />
            <div className="hidden sm:block text-left hover:bg-gray-50 hover:text-black">
              <div className="text-sm font-medium ">
                {session?.user?.name ?? 'User'}
              </div>
              {session?.user?.email && (
                  <div className="text-xs text-gray-500">{session.user.email}</div>
              )}
            </div>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;