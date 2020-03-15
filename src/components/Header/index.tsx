import React, { FC } from 'react';
import { Layout, InputNumber, Button } from 'antd';
import TabMenu from './tabmenu';
import { connect } from 'dva';
import { IAPPModel, TAPPDispatch } from '@/models/APPModal';

interface IProps {
  dispatch: TAPPDispatch;
  refresh: number;
  auto: boolean;
  refreshNum: number;
}

const { Header } = Layout;

const OPSHeader: FC<IProps> = props => {
  const { refresh, auto, refreshNum, dispatch } = props;
  const onChange = (type: string, v: any) => {
    if (type === 'num') {
      dispatch({
        type: 'APP/setRefreshNum',
        refreshNum: v,
      });
    } else if (type === 'refresh') {
      dispatch({
        type: 'APP/setRefresh',
        refresh: v,
      });
    } else if (type === 'auto') {
      dispatch({
        type: 'APP/setAuto',
        auto: v,
      });
    } 
  }
  return (
    <Header className="ops_header">
      <div className="logo">
        <img src="log.jpeg" alt="aiops" height={30} width={150} />
      </div>
      <div className="ops_header_center">
        <TabMenu />
      </div>
      <div className="ops_header_refresh">
        <Button onClick={() => onChange('auto', !auto)}>自动</Button>
        <InputNumber
          min={3}
          max={60}
          value={refreshNum}
          onChange={e => onChange('num', e)}
          formatter={value => `${value}s`}
          parser={value => value.replace('s', '')}
        />
        <Button onClick={() => onChange('refresh', refresh + 1)}>刷新</Button>
      </div>
    </Header>
  );
}
export default connect((state: { APP: IAPPModel['state'] }) => {
  return {
    refresh: state.APP.refresh,
    auto: state.APP.auto,
    refreshNum: state.APP.refreshNum,
  };
})(OPSHeader);