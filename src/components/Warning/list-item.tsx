import React, { FC } from 'react';
import moment from 'moment';
import { WarnInfo, scopeMap } from './type';
const WarnItem: FC<WarnInfo> = props => {
  const { key, message, startTime, scope } = props;
  return (
    <div className="warning-list-item">
      <div className="warning-list-item-time">
        {moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
      </div>
      <div className="warning-list-item-dot">
        <div
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#448dfe',
            borderRadius: '3px',
          }}/>
      </div>
      <div className="warning-list-item-info">
        <div className="warning-list-item-info-msg">
          {`#${key}  ${message}`}
        </div>
        <div>
          <span className="warning-list-item-scope">
            {scopeMap[`${scope}`]}
          </span>
        </div>
      </div>
    </div>
  );
}
export default WarnItem;