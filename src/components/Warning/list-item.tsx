import React, { FC } from 'react';
import moment from 'moment';
import { WarnInfo, scopeMap, scopeColorMap } from './type';
const WarnItem: FC<WarnInfo> = props => {
  const { id, message, startTime, scope } = props;
  return (
    <div className="warning-list-item">
      <div className="warning-list-item-time">
        {moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
      </div>
      <div className="warning-list-item-dot">
        <div
          style={{
            width: '7px',
            height: '7px',
            backgroundColor: '#448dfe',
            borderRadius: '3.5px',
          }}/>
      </div>
      <div className="warning-list-item-info">
        <div className="warning-list-item-info-msg">
          {`#${id}  ${message}`}
        </div>
        <div>
          <span
            className="warning-list-item-scope"
            style={{
              border: `1px solid ${scopeColorMap[`${scope}`]}`,
              color: `${scopeColorMap[`${scope}`]}`,
            }}
          >
            {scopeMap[`${scope}`]}
          </span>
        </div>
      </div>
    </div>
  );
}
export default WarnItem;