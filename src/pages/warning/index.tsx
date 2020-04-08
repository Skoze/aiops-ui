import React, { FC, useState, useEffect, useContext } from 'react';
import WarningHeader from '../../components/Warning/header';
import WarningList from '../../components/Warning';
import { WarnInfo } from '@/components/Warning/type';
import { DurationContext } from '@/layouts';
import { message } from 'antd';
import request from '@/utils/request';
interface IWarningProps {
}
const Warning: FC<IWarningProps> = props => {
  const { duration } = useContext(DurationContext);
  const [filter, setFilter] = useState({
    scope: 'All',
    keyword: '',
    pageNum: 1,
  });
  const [warningList, setWarningList] = useState<WarnInfo[]>([]);
  useEffect(() => {
    /*const res = [
      {
        id: '6',
        message:
          'Response time of service instance projectA.business-zone-pid:4169@skywalking-server-0001 is more than 1000ms in last 10 minutes.',
        startTime: 1586098582180,
        scope: 'ServiceInstance',
      },
      {
        id: '4',
        message:
          'Response time of service projectB.business-zone is more than 1000ms in last 10 minutes.',
        startTime: 1586098582180,
        scope: 'Service',
      },
      {
        id: '2',
        message:
          'Response time of service load balancer2.system is more than 1000ms in last 10 minutes.',
        startTime: 1586098582180,
        scope: 'Service',
      },
      {
        id: '3_L3Byb2plY3RBL3Rlc3Q=_0',
        message:
          'Response time of endpoint /projectA/test in load balancer1.system is more than 1000ms in last 10 minutes.',
        startTime: 1586098582180,
        scope: 'Endpoint',
      },
      {
        id: '4_L3Byb2plY3RCL3t2YWx1ZX0=_0',
        message:
          'Response time of endpoint /projectB/{value} in projectB.business-zone is more than 1000ms in last 10 minutes.',
        startTime: 1586098582180,
        scope: 'Endpoint',
      },
    ]; //获取后端数据并处理数据*/
    request.get('/alarm/')
    .then(res => {
      setWarningList(res);
    })
    .catch(err => {
      message.error(err.message);
    })
  }, [filter, duration]);
  return (
    <div>
      <WarningHeader filter={filter} onChange={f => setFilter(f)} />
      <WarningList warningList={warningList} />
    </div>
  );
};

export default Warning;
