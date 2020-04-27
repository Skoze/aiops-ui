import { Empty, Tag, Drawer } from 'antd';
import React, { useState, useEffect } from 'react';
import { getSpans } from '@/api/trace';
import styles from './trace-detail.css';
import TraceTree from './trace-tree';
import SpanDetail from './span-detail';

export default function TraceDetail({ trace }) {
  const [spans, setSpans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  useEffect(() => {
    let isFetching = true;
    if (trace) {
      setSpans([]);
      getSpans(trace.id).then(data => {
        if (isFetching) {
          setSpans(data);
        }
      });
    }
    return () => {
      isFetching = false;
    };
  }, [trace]);

  if (!trace) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  } else {
    return (
      <div className={styles['trace-detail']}>
        <div className={styles['trace-header']}>
          <div className={`${styles['trace-name']} ${trace.isError && styles['error']}`}>
            {trace.endpointNames[0]}
          </div>
          <div>
            <Tag color="black">起始时间</Tag>
            <span className={styles['trace-data']}>{trace.start}</span>
            <Tag color="black">持续时间</Tag>
            <span className={styles['trace-data']}>{trace.duration}ms</span>
            <Tag color="black">跨度</Tag>
            <span className={styles['trace-data']}>{spans.length}</span>
          </div>
        </div>
        <div className={styles['trace-content']}>
          <TraceTree
            spans={spans}
            onSelect={val => {
              setSelected(val);
              setShowDrawer(true);
            }}
          ></TraceTree>
        </div>
        <Drawer
          title="跨度信息"
          placement="left"
          visible={showDrawer}
          width="fit-content"
          drawerStyle={{ minWidth: '40vw', maxWidth: '100vw' }}
          destroyOnClose
          onClose={() => setShowDrawer(false)}
        >
          <SpanDetail span={selected}></SpanDetail>
        </Drawer>
      </div>
    );
  }
}
