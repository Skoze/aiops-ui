import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

export default function DurationPicker({ range, changeDuration }) {
  return (
    <DatePicker.RangePicker
      value={range}
      format="YYYY-MM-DD HH:mm:ss"
      onChange={changeDuration}
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
  );
}
