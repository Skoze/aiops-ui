import React, { FC } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
interface IMenuProps {
  menu: Array<{icon: string; label: string; url: string}>;
}

const TabMenu: FC<IMenuProps> = props => {
  const { menu } = props;
  return (
    <div className="header_menu">
      <img src="log.jpeg" alt="aiops" height={20} width={100} />
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