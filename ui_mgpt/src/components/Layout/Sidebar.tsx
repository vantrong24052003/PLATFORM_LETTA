// 参照: openspec/changes/setup-project/specs/ui-layout/spec.md

import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { RobotOutlined, BookOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuItem[] = [
    {
      key: '/ai-assistants',
      icon: <RobotOutlined />,
      label: 'AIアシスタント',
    },
    {
      key: '/knowledge-base',
      icon: <BookOutlined />,
      label: 'ナレッジベース',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  // Determine the selected key based on current location
  const getSelectedKey = () => {
    if (location.pathname.startsWith('/knowledge-base')) {
      return '/knowledge-base';
    }
    if (location.pathname.startsWith('/ai-assistants')) {
      return '/ai-assistants';
    }
    return '/knowledge-base';
  };

  return (
    <Sider
      width={250}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        TOMOSIA MGPT
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={items}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
}

export default Sidebar;

