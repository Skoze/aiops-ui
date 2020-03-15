import React, { FC } from 'react';
import { WarnInfo } from './type';
import WarnItem from './list-item';
import './index.less';
interface IWarningListProps{
  warningList: Array<WarnInfo>;
}
const WarningList: FC<IWarningListProps> = props => {
  const { warningList } = props;
  return (
    <div className="warning-list">
      <div
        style={{
          width: '1px',
          height: '100%',
          backgroundColor: '#448dfe',
          position: 'absolute',
          left: '140px',
        }}
      />
      {
        warningList.map(warn => (
          <WarnItem
            {...warn}
            key={warn.startTime.toString()}
          />
        ))
      }
    </div>
  );
};
export default WarningList;