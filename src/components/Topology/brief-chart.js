import React from 'react';
import ReactEcharts from 'echarts-for-react';
export default ({ option, name }) => {
  return (
    <div style={{ height: '20vh', paddingBottom: '1.5em' }}>
      <h4 style={{ color: '#aaa', position: 'relative', left: '0.5em' }}>{name}</h4>
      <ReactEcharts option={changeStyle(option)} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

function changeStyle(option) {
  return {
    ...option,
    legend: {
      ...option.legend,
      textStyle: {
        color: '#aaa',
      },
    },
    yAxis: {
      ...option.yAxis,
      axisLabel: {
        color: '#aaa',
      },
    },
  };
}
