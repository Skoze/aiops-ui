import React, { FC } from 'react';
import { instanceDate } from '../../type';
import './time-item.less';
interface ITimeItemProps extends instanceDate {
 max: number;
 color: string;
 unit: string;
}
const TimeItem: FC<ITimeItemProps> = props => {
	const { name, value = 0, max, color, unit} = props;
  const percent = (value / (max ? max : 100) * 100).toFixed(2) + '%';
  return (
		<div className="dashboard-timeline-item">
      <div className="dashboard-timeline-item-layer1">
        <span className="dashboard-timeline-item-value">{value} {unit}</span>
        <span>{name}</span>
      </div>
      <div className="dashboard-timeline-item-layer2">
        <div className="dashboard-timeline-item-line">
          <div
            className="dashboard-timeline-item-line"
            style={{
              width: percent,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
	);
};
export default TimeItem;