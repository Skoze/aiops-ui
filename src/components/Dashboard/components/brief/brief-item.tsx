import React, { FC, useMemo } from 'react';
import { Icon } from 'antd';
import { BriefInf } from '../../type';
import './brief-item.less';
interface IBriefItemProps {
    name: BriefInf;
    value: number;
};
const BriefInfoItem: FC<IBriefItemProps> = props => {
  const { name, value } = props;
  const type = useMemo(() => {
    switch (name) {
      case BriefInf.numOfDatabase:
        return 'database';
      case BriefInf.numOfService:
        return 'appstore';
      case BriefInf.numOfEndpoint:
        return 'aliyun';
      default:
        return '';
    }
  }, [name]);
  return (
    <div className="dashboard-brief-item">
      {
        type && <Icon type={type} />
      }
      <span className="dashboard-brief-name">{name}</span>
      <span className="dashboard-brief-value">{value}</span>
    </div>
  );
};
export default BriefInfoItem;