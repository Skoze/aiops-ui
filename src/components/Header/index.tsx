import React, { FC, useState, useEffect } from 'react';
import { Layout, InputNumber, Button } from 'antd';
import TabMenu from './tabmenu';
import { connect } from 'dva';
import { IAPPModel, TAPPDispatch } from '@/models/APPModal';
import './header.less';
interface IProps {
  dispatch: TAPPDispatch;
  refresh: number;
  auto: boolean;
  refreshNum: number;
}

const { Header } = Layout;

const OPSHeader: FC<IProps> = (props) => {
  // const { refresh, auto, refreshNum, dispatch } = props;
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
  // const onChange = async (type: string, v: any) => {
  //   if (type === 'num') {
  //     dispatch({
  //       type: 'APP/setRefreshNum',
  //       refreshNum: v,
  //     });
  //   } else if (type === 'refresh') {
  //     dispatch({
  //       type: 'APP/setRefresh',
  //       refresh: v,
  //     });
  //   } else if (type === 'auto') {
  //     await dispatch({
  //       type: 'APP/setAuto',
  //       auto: v,
  //     });
  //     if (v) {
  //       dispatch({
  //         type: 'APP/AutoRefresh',
  //         auto: v,
  //       });
  //     }
  //   }
  // };
  useEffect(() => {
    let interval;
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
          // onClick={() => onChange('auto', !auto)}
          onClick={() => setAuto(!auto)}
        >
          自动
        </Button>
        <InputNumber
          min={3}
          max={60}
          size="small"
          value={refreshNum}
          // onChange={(e) => onChange('num', e)}
          onChange={setRefreshNum}
          formatter={(value) => `${value}s`}
          parser={(value) => value?.replace('s', '')}
        />
        <Button
          type="primary"
          size="small"
          icon="sync"
          // onClick={() => onChange('refresh', refresh + 1)}
          onClick={refresh}
        >
          刷新
        </Button>
      </div>
    </Header>
  );
};
// export default connect((state: { APP: IAPPModel['state'] }) => {
//   return {
//     refresh: state.APP.refresh,
//     auto: state.APP.auto,
//     refreshNum: state.APP.refreshNum,
//   };
// })(OPSHeader);
export default OPSHeader;
