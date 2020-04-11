import React, { FC } from 'react';
const FilterBase: FC<{ label: React.ReactNode }> = props => {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '10px',
          marginLeft: '15px',
          }}
        >
        <label style={{ flexShrink: 0, marginRight: 8 }}>{props.label}</label>
        {props.children}
      </div>
    );
  };
  
export default FilterBase;