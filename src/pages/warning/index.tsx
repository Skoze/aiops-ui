import React, { FC, useState, useEffect } from 'react';
import WarningHeader from '../../components/Warning/header';
import WarningList from '../../components/Warning';
import { Duration } from '@/components/Dashboard/type';
interface IWarningProps{
  duration: Duration;
  refresh: number;
}
const Warning: FC<IWarningProps> = props => {
  const { refresh, duration } = props;
  const [filter, setFilter] = useState({
    scope: 'All',
    keyword: '',
    pageNum: 1,
  });
  const [warningList, setWarningList] = useState();
  useEffect(()=> {
    const res = [];//获取后端数据并处理数据
    setWarningList(res);
  },[filter, refresh, duration])
  return (
    <div>
      <WarningHeader
        filter={filter}
        onChange={f => setFilter(f)}
      />
      <WarningList
        warningList={warningList}
      />
    </div>
  );
};
export default Warning;