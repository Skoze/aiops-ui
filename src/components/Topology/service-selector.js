import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Checkbox } from 'antd';
import styles from './service-selector.css';

export default function({ services = [], onChange }) {
  const options = useMemo(() => {
    return services.map(node => ({ label: node.name, value: node.id }));
  }, [services]);
  const ids = useMemo(() => services.map(node => node.id), [services]);
  const [checkedList, setCheckedList] = useState(ids);

  const selectCount = useMemo(() => {
    let result = 0;
    for (let id of ids) {
      for (let checked of checkedList) {
        if (id === checked) {
          result++;
          break;
        }
      }
    }
    return result;
  }, [ids, checkedList]);

  const handleChange = useCallback(
    list => {
      setCheckedList(list);
      onChange(list);
    },
    [onChange],
  );

  useEffect(() => {
    handleChange(services.map(node => node.id));
  }, [services, handleChange]);

  return (
    <div className={styles['container']}>
      <Checkbox
        checked={selectCount === services.length}
        indeterminate={selectCount !== services.length && selectCount !== 0}
        onChange={({ target: { checked } }) => {
          handleChange(checked ? ids : []);
        }}
      >
        全选
      </Checkbox>
      <Checkbox.Group
        className={styles['checkbox-group']}
        options={options}
        value={checkedList}
        onChange={handleChange}
      />
    </div>
  );
}
