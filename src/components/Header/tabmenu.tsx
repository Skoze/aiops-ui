import React, { FC } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import logo from '../../assets/logo.png';
interface IMenuProps {
  menu: Array<{icon: string; label: string; url: string}>;
}

const TabMenu: FC<IMenuProps> = props => {
  const { menu } = props;
  return (
    <div className="header_menu">
      <img src={logo} alt="aiops" height={60} style={{ marginRight: '20px' }} />
      {
        menu.map(item => {
          return (
            <Link
              className="header_menu_item"
              to={item.url}
              key={item.label}
            >
              <Icon type={item.icon} />
              <span className="header_menu_item_label">
                {item.label}
              </span>
            </Link>
          )
        })
      }
    </div>
  );
  
}

export default TabMenu;