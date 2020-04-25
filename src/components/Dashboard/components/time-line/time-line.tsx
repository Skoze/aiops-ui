import React, { FC } from 'react';
import TimeItem from './time-item';
import { instanceDate } from '../../type';
interface ITimeLineProps {
  data: Array<instanceDate>;
  unit: string;
  color: string;
}
const TimeLine: FC<ITimeLineProps> = props => {
	const { data = [], unit = '%', color = 'inherit' } = props;
	const max = data.reduce((p, c) => {
    if (p < Number(c.value)) {
      return c.value;
    }
    return p;
  }, 0);
  return (
    <div
      style={{
        height: '100%',
      }}
    >
      {
        data.map(item => {
          return (
            <TimeItem
              max={max}
              {...item}
              unit={unit}
              color={color}
              //color={item.isValid? color : 红色}
            />
          );
        })
      }
    </div>
	);
};
export default TimeLine;