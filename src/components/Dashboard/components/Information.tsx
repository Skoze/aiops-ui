import React, { FC } from 'react';
import { ServiceInstancesType } from '../type';
import './information.less';
interface IInfoProps {
  info: ServiceInstancesType;
};
const Info: FC<IInfoProps> = props => {
  const { info } = props;
  return (
    <div style={{
      height: '100%',
      }}
    >
      <h5>{info.name}</h5>
      <div className="dashboard-information">
        <span className="dashboard-information-label">Language</span>
        <span className="dashboard-information-value">{info.language}</span>
      </div>
    {
      info.attributes.map(item => {
        return (
            <div className="dashboard-information">
              <span className="dashboard-information-label">{item.name}</span>
              <span className="dashboard-information-value">{item.value}</span>
            </div>
        );
      })
    }
    </div>
  );
};
export default Info;