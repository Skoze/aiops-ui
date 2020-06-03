import TraceSearch from '@/components/Trace/trace-search';
import TraceTable from '@/components/Trace/trace-table';
import TraceDetail from '@/components/Trace/trace-detail';
import React, { useState, useEffect, useContext } from 'react';
import { getTraces } from '@/api/trace';
import { Pagination, Dropdown, Menu, Icon, Layout } from 'antd';
import { DurationContext } from '@/layouts';
import styles from './index.css';

const queryOrderMap = {
  BY_START_TIME: '开始时间',
  BY_DURATION: '持续时间',
};
const defaultPageSize = 10;

export default function Trace() {
  const { duration, range } = useContext(DurationContext);
  const [query, setQuery] = useState({
    duration,
    traceState: 'ALL',
  });
  const [pageNum, setPageNum] = useState(1);
  const [queryOrder, setQueryOrder] = useState('BY_START_TIME');

  const [traces, setTraces] = useState({ traces: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const [selectedTrace, setSelectedTrace] = useState();

  useEffect(() => {
    let isFetching = true;
    setLoading(true);
    const body = {
      ...query,
      queryOrder,
      paging: {
        pageNum,
        pageSize: defaultPageSize,
      },
    };
    getTraces(body).then(data => {
      if (isFetching) {
        setTraces(data);
        setSelectedTrace(data.traces[0]);
        setLoading(false);
      }
    });
    return () => {
      isFetching = false;
    };
  }, [pageNum, query, queryOrder]);

  return (
    <div className={styles['container']}>
      <div className={styles['card']}>
        <TraceSearch
          defaultQuery={query}
          defaultRange={range}
          onSearch={query => {
            setPageNum(1);
            setQuery({ duration, ...query });
          }}
        />
      </div>
      <Layout>
        <Layout.Sider className={`${styles['aside']} ${styles['card']}`}>
          <div className={styles['container']}>
            <div className={styles['table-header']}>
              <Pagination
                simple
                current={pageNum}
                pageSize={defaultPageSize}
                total={traces.total || 1}
                onChange={setPageNum}
              />
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) => {
                      setPageNum(1);
                      setQueryOrder(key);
                    }}
                  >
                    {Object.keys(queryOrderMap).map(key => (
                      <Menu.Item key={key}>{queryOrderMap[key]}</Menu.Item>
                    ))}
                  </Menu>
                }
                placement="bottomRight"
              >
                <span>
                  {queryOrderMap[queryOrder]}
                  <Icon type="down" />
                </span>
              </Dropdown>
            </div>
            <TraceTable
              items={traces.traces}
              loading={loading}
              selected={selectedTrace}
              onSelect={setSelectedTrace}
            ></TraceTable>
          </div>
        </Layout.Sider>
        <Layout.Content className={styles['card']}>
          <TraceDetail trace={selectedTrace}></TraceDetail>
        </Layout.Content>
      </Layout>
    </div>
  );
}
