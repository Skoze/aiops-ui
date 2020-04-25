import React, { useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.css';

export default function DurationPicker({ range, changeDuration }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles['container']}>
      <div
        className={styles['time']}
        onClick={() => {
          setShow(true);
        }}
      >
        <span>{moment(range[0]).format('YYYY-MM-DD HH:mm:ss')}</span>
        <span> ~ </span>
        <span>{moment(range[1]).format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>
      <DatePicker.RangePicker
        className={styles['picker']}
        open={show}
        value={range}
        format="YYYY-MM-DD HH:mm:ss"
        onChange={changeDuration}
        onOpenChange={setShow}
        showTime={{ format: 'HHmmss' }}
        allowClear={false}
        ranges={{
          最近15分钟: [moment().subtract(15, 'minutes'), moment()],
          最近30分钟: [moment().subtract(30, 'minutes'), moment()],
          最近1小时: [moment().subtract(1, 'hours'), moment()],
          最近1天: [moment().subtract(1, 'days'), moment()],
          最近1周: [moment().subtract(1, 'weeks'), moment()],
          最近1个月: [moment().subtract(1, 'months'), moment()],
        }}
      />
    </div>
  );
}
