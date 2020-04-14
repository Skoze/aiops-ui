import { Empty, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { getSpans } from '@/api/trace';
import styles from './trace-detail.css';

export default function TraceDetail({ trace }) {
  const [spans, setSpans] = useState([]);
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
        <div className={styles['trace-content']}></div>
      </div>
    );
  }
}
