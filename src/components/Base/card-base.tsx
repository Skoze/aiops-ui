import React, { FC } from 'react';
const CardBase: FC<{ label: React.ReactNode, style?: any }> = props => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        paddingLeft: '5px',
        paddingRight:'5px',
        ...props.style
      }}
    >
      <div
        style={{
          lineHeight: '16px',
          borderRadius: '2px',
          backgroundColor: 'rgba(196, 200, 225, 0.2)',
          color: '#9da5b2',
          padding: '6px 10px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {props.label}
      </div>
      <div
        style={{
          flex: '1',
          padding: '7px 10px',
          height: 'calc(100% - 28px)',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
  
export default CardBase;