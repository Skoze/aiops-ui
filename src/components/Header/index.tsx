import React, { FC, useState, useEffect } from 'react';
import { Layout, InputNumber, Button } from 'antd';
import TabMenu from './tabmenu';
import './header.less';
interface IProps {
  refresh: Function;
}

const { Header } = Layout;

const OPSHeader: FC<IProps> = (props) => {
  const { refresh } = props;
  const [refreshNum, setRefreshNum] = useState(6);
  const [auto, setAuto] = useState(false);
  const menu = [
    {
      icon: 'area-chart',
      label: '仪表盘',
      url: '/dashboard',
    },
    {
      icon: 'deployment-unit',
      label: '拓扑图',
      url: '/topology',
    },
    {
      icon: 'branches',
      label: '追踪',
      url: '/traces',
    },
    {
      icon: 'warning',
      label: '告警',
      url: '/warning',
    },
  ];
  useEffect(() => {
    let interval:number|undefined;
    if (auto) {
      interval = setInterval(refresh, refreshNum * 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [auto, refresh, refreshNum]);
  return (
    <Header className="ops_header">
      <TabMenu menu={menu} />
      <div className="ops_header_refresh">
        <Button
          type="primary"
          size="small"
          onClick={() => setAuto(!auto)}
        >
          自动
        </Button>
        <InputNumber
          min={3}
          max={60}
          size="small"
          formatter={(value) => `${value}s`}
          parser={(value) => value?.replace('s', '')}
          value={refreshNum}
          onChange={setRefreshNum}
        />
        <Button
          type="primary"
          size="small"
          icon="sync"
          onClick={refresh}
        >
          刷新
        </Button>
      </div>
    </Header>
  );
};
export default OPSHeader;
