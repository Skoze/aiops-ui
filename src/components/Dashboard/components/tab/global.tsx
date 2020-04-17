import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import { translateToHeatMapChart, translateToStackLineChart, Duration, DataPackage } from '../../type';
import PackageCard from '../package-card';
import request from '@/utils/request';
interface IGlobalProps{
  duration: Duration;
  id?: string;
}
const Global: FC<IGlobalProps> = props => {
  const { id = '', duration } = props;
  const [globalData, setGlobalData] = useState<Array<DataPackage>>([]);
  useEffect(() => {
    request.post('/global/', {
      duration,
    }).then(res => {
      const result: Array<DataPackage> = [];
      Object.keys(res).forEach(key => {
        switch (key){
          case 'heatmapGraph':
            result.push({
              label: 'Global Heatmap',
              type: 'chart',
              unit: '',
              style: { height: '250px', width: '50%'},
              value: translateToHeatMapChart({
                name: 'Global Heatmap',
                value: res.heatmapGraph.nodes,
                responseTimeStep: res.heatmapGraph.responseTimeStep,
              }, duration),
            });
            break;
          case 'globalPercentile':
            result.push({
              label: 'Global Response Time Percentile',
              type: 'chart', // chart, avgChart, line, info, brief
              unit: '',
              style: { height: '250px', width: '50%'},
              value: translateToStackLineChart(
                Object.keys(res.globalPercentile).map(key => {
                  return {
                    name: key,
                    values: res.globalPercentile[`${key}`],
                  }
                }), duration),
            });
            break;
          case 'globalBrief':
            result.push({
              label: 'Global Brief',
              type: 'brief', // chart, avgChart, line, info, brief
              unit: '个',
              style: { height: '250px', width: '25%'},
              info: res.globalBrief,
            });
            break;
          case 'globalThroughput':
            result.push({
              label: 'Global Top Throughput',
              type: 'line', // chart, avgChart, line, info, brief
              unit: 'cpm',
              style: { height: '250px', width: '25%'},
              value: res.globalThroughput,
              color: 'rgb(63, 177, 227)',
            });
            break;
          case 'globalSlow':
            result.push({
              label: 'Global Top Slow Endpoint',
              type: 'line', // chart, avgChart, line, info, brief
              unit: 'ms',
              style: { height: '250px', width: '50%'},
              value: res.globalSlow,
              color: 'rgb(191, 153, 248)',
            });
            break;
          default:
            break;
        }
      });
      setGlobalData(result);
    })
    .catch(e => {
      message.error(e.message);
    });
  }, [ id, duration]);
  return (
    <div
      style={{
        padding: '20px 15px',
      }}
    >
      {
        globalData.map(item => (
          <PackageCard
            data={item}
          />
        ))
      }
    </div>
  );
};
export default Global;
//globalHeatmap,globalPercentile,globalBrief,globalThroughput,globalSlow
