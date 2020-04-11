import React, { FC, useState, useEffect, useContext } from 'react';
import WarningHeader from '../../components/Warning/header';
import WarningList from '../../components/Warning';
import { WarnInfo, WarningFilter } from '@/components/Warning/type';
import { DurationContext } from '@/layouts';
import { message } from 'antd';
import request from '@/utils/request';
interface IWarningProps {
}
const Warning: FC<IWarningProps> = props => {
  const { duration } = useContext(DurationContext);
  const [filter, setFilter] = useState<WarningFilter>({
    scope: 'All',
    keyword: '',
    pageNum: 1,
  });
  const [total, setTotal] = useState(0);
  const [warningList, setWarningList] = useState<WarnInfo[]>([]);
  useEffect(() => {
    request.post('/alarm/', { 
      duration,
      keyword: filter.keyword,
      paging: {
        "pageNum": filter.pageNum,
        "pageSize": 20
      },
      scope: filter.scope,
    })
    .then(res => {
      setWarningList(res.item);
      setTotal(res.total)
    })
    .catch(err => {
      message.error(err.message);
    })
  }, [filter, duration]);
  return (
    <div>
      <WarningHeader {...filter} total={total} onChange={f => setFilter(f)} />  
      <WarningList warningList={warningList} />
    </div>
  );
};

export default Warning;
