import React, { FC } from 'react';
import { BriefInf, BriefInfMap } from '../../type';
import BriefInfoItem from './brief-item';
interface IBriefProps {
  info: {
    [key in BriefInf]: number;
  };
};
const BriefInfo: FC<IBriefProps> = props => {
  const { info } = props;
  return (
    <div
      style={{
        height: '100%',
      }}
    >
    {
      Object.keys(info).map(key => {
        return (
            <BriefInfoItem
              name={BriefInfMap[key]}
              value={info[BriefInfMap[key]]}
            />
        );
      })
    }
    </div>
  );
};
export default BriefInfo;