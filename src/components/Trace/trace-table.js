import React from 'react';
import { List, Tag } from 'antd';
import moment from 'moment';
import styles from './trace-table.css';

export default function TraceTable({ items, loading, selected, onSelect }) {
  return (
    <List
      className={styles['list']}
      loading={loading}
      dataSource={loading ? [] : items}
      renderItem={item => (
        <List.Item
          className={`${styles['item']} ${selected === item && styles['selected']} ${item.isError &&
            styles['error']}`}
          onClick={() => onSelect(item)}
        >
          <div className={styles['item-name']}>{item.endpointNames[0]}</div>
          <div>
            <Tag color="black">{item.duration} ms</Tag>
            <span className={styles['item-time']}>
              {moment(parseInt(item.start)).format('YYYY-MM-DD HH:mm')}
            </span>
          </div>
        </List.Item>
      )}
    />
  );
}
