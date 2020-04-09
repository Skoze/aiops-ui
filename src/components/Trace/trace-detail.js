import { Empty, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { getSpans } from '@/api/trace';
import styles from './trace-detail.css';

export default function TraceDetail({ trace }) {
  const [spans, setSpans] = useState([]);
  useEffect(() => {
    if (trace) {
      setSpans([]);
      console.log(trace);
      getSpans(trace.id).then(data => {
        setSpans(data);
      });
    }
  }, [trace]);

  if (!trace) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
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
          <span className={styles['trace-data']}>0</span>
        </div>
      </div>
      <div className={styles['trace-content']}>{JSON.stringify(spans)}</div>
    </div>
  );
}
