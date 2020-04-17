import React, { FC } from 'react';
import { Statistic } from 'antd';
import CardBase from '@/components/Base/card-base';
import TimeLine from './time-line/time-line';
import Chart from './chart';
import Info from './Information';
import BriefInfo from './brief';
import { DataPackage } from '../type';

interface IPackageCardProps {
  data: DataPackage;
};
const PackageCard: FC<IPackageCardProps> = props => {
  const { data } = props;
  return (
    <div
      style={{
        ...data.style,
        padding: '0 5px',
      }}
    >
      {
        data.type === 'avgChart'
        && <CardBase label={data.avgLabel}>
           <Statistic
            value={data.avg}
            precision={2}
            suffix={data.unit}
          />
        </CardBase>
      }
      {
        data.type === 'line'
        && <CardBase label={data.label}>
          <TimeLine
           data={data.value}
           unit={data.unit}
           color={data.color || 'rgb(191, 153, 248)'}
          />
        </CardBase>
      }
      {
        (data.type === 'chart' || data.type === 'avgChart')
        && <CardBase label={data.label}>
          <Chart series={data.value}/>
        </CardBase>
      }
      {
        data.type === 'info'
        && <CardBase label={data.label}>
          <Info info={data.info} />
        </CardBase>
      }
      {
        data.type === 'brief'
        && <CardBase label={data.label}>
          <BriefInfo info={data.info} />
        </CardBase>
      }
    </div>
  );
};
export default PackageCard;