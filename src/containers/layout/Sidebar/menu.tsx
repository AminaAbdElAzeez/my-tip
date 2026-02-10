import { Menu } from 'antd';
import getMenuItems from './options';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const MyMenu = ({ collapsed }) => {
  const location = useLocation();
  const pathname = location.pathname.substring(1).split('/');
  // const selectedKey = location.pathname.replace('/admin/', '');
  const selectedKey = location.pathname;

  // const profile = useSelector((state:any) => state.profile?.data ?? null);
  // const userType = profile?.type;
  // const userType = profile?.type ?? 1;
  const userType = useSelector((state: any) => state.Auth.type);

  const transformMenuItems = (items) =>
    items.map(({ key, to, label, icon, onClick, hidden, children, ...others }) => {
      if (hidden) return null;
      return {
        key: to || key,
        icon: (
          <div className="icon-wraper -ms-4 h-full px-2 leading-normal align-baseline inline-flex">
            {icon}
          </div>
        ),
        label: to ? (
          <Link to={to} className="ms-0.5">
            {label}
          </Link>
        ) : (
          label
        ),
        onClick,
        children: children ? transformMenuItems(children) : undefined,
        ...others,
      };
    });

  const menuItems = transformMenuItems(getMenuItems(userType));

  if (!userType) return null;

  return (
    <motion.div
      key={collapsed}
      initial={{ y: 30, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        delay: 0.3,
        duration: 0.3,
      }}
    >
      <style>{`.sider-antd-sub-menu.ant-menu-submenu-inline ul.ant-menu-inline{border-radius:12px;}`}</style>
      <Menu
        className="sidebarItem h-full bg-transparent !border-none"
        mode="inline"
        // selectedKeys={[...pathname]}
        defaultSelectedKeys={['']}
        items={menuItems}
        selectedKeys={[selectedKey]}
        defaultOpenKeys={[]}
      />
    </motion.div>
  );
};

export default MyMenu;
