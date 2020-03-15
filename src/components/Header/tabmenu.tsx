import React, { FC } from 'react';
import { Icon } from 'antd';
import router from 'umi/router';
interface IMenuProps {
}

const TabMenu: FC<IMenuProps> = props => {
  const menu = [{
    icon: 'area-chart', label: '仪表盘', url: '/dashboard',
  }, {
    icon: 'deployment-unit', label: '拓扑图', url: '/topology',
  }, {
    icon: 'branches', label: '追踪', url: '/traces',
  }, {
    icon: 'warning', label: '告警', url: '/warning',
  }]
  return (
    <div className="header_menu">
      {
        menu.map(item => {
          return (
            <div
              className="header_menu_item"
              onClick={e => router.push(item.url)}
              key={item.label}
            >
              <Icon type={item.icon} />
              <span className="header_menu_item_label">
                {item.label}
              </span>
            </div>
          )
        })
      }
    </div>
  );
  
}

export default TabMenu;