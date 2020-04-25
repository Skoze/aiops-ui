import styles from './span-detail.css';
import moment from 'moment';
import { Collapse } from 'antd';
const Item = ({ title, children }) => {
  if (children) {
    return (
      <div className={styles['item']}>
        <span className={styles['item-title']}>{title}: </span>
        <span className={styles['item-content']}>{children}</span>
      </div>
    );
  } else {
    return <div></div>;
  }
};

const Logs = ({ logs }) => {
  return (
    <Collapse className={styles['log']}>
      {logs.map(({ time, data }, index) => (
        <Collapse.Panel header={moment(time).format('YYYY-MM-DD HH:mm:ss')} key={index}>
          {data.map(({ key, value }) => {
            if (key === 'stack') {
              return (
                <div key={key} className={styles['log-stack']}>
                  <code>{value}</code>
                </div>
              );
            }
            return (
              <div key={key}>
                <span className={styles['log-key']}>{key}:</span>
                <span>{value}</span>
              </div>
            );
          })}
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default function({ span }) {
  if (!span) {
    return <div></div>;
  }
  return (
    <div className={styles['span-detail-container']}>
      <h2>{span.endpointName}</h2>
      <Item title="跨度类型">{span.type}</Item>
      <Item title="组件">{span.component}</Item>
      <Item title="Peer">{span.peer || 'No Peer'}</Item>
      {span.tags.map(({ key, value }) => (
        <Item title={key} key={key}>
          {value}
        </Item>
      ))}
      <Item title="日志信息">
        {span.logs.length ? (
          <Logs logs={[...span.logs].sort((a, b) => a.time - b.time)}></Logs>
        ) : (
          '无'
        )}
      </Item>
    </div>
  );
}
