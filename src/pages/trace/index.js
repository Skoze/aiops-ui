import TraceSearch from '@/components/Trace/trace-search';
import TraceTable from '@/components/Trace/trace-table';
import { useState, useEffect } from 'react';
import { trace } from '@/api/trace';
import { Pagination, Dropdown, Menu, Icon } from 'antd';

const queryOrderMap = {
  BY_START_TIME: '开始时间',
  BY_DURATION: '持续时间',
};
const defaultPaging = { pageNum: 1, pageSize: 5 };

export default function Trace() {
  const [query, setQuery] = useState({
    duration: { start: '2020-04-04 2254', end: '2020-04-04 2309', step: 'MINUTE' },
  });
  const [paging, setPaging] = useState(defaultPaging);
  const [queryOrder, setQueryOrder] = useState('BY_START_TIME');

  const [traces, setTraces] = useState({ traces: [], total: 0 });
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    let isFetching = true;
    setLoading(true);
    const body = {
      ...query,
      queryOrder,
      paging,
    };
    trace(body).then((data) => {
      if (isFetching) {
        setTraces(data);
        setLoading(false);
      }
    });
    return () => {
      isFetching = false;
    };
  }, [paging, query, queryOrder]);

  return (
    <div>
      <TraceSearch defaultQuery={query} onSearch={setQuery} />
      <div>
        <div>
          <Pagination simple pageSize={paging.pageSize} total={traces.total} onChange={setPaging} />
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => setQueryOrder(key)}>
                {Object.keys(queryOrderMap).map((key) => (
                  <Menu.Item key={key}>{queryOrderMap[key]}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <span>
              {queryOrderMap[queryOrder]}
              <Icon type="down" />
            </span>
          </Dropdown>
        </div>
        <TraceTable
          items={traces.traces}
          total={traces.total}
          loading={loading}
          onPageChange={setPaging}
          queryOrder={queryOrder}
          onQueryOrderChange={setQueryOrder}
        >
          hiahiahia
        </TraceTable>
      </div>
    </div>
  );
}
