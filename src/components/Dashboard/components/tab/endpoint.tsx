import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import { DataPackage, translateToLineChart, translateToStackLineChart, Duration, translateToSanKeyChart } from '../../type';
import PackageCard from '../package-card';
import request from '@/utils/request';
interface IEndpointPanelProps{
  refresh: number;
  duration: Duration;
  id?: string;
}
const EndpointPanel: FC<IEndpointPanelProps> = props => {
  const { refresh, duration, id = '' } = props;
  const [endpointData, setEndpointData] = useState<Array<DataPackage>>([]);
  useEffect(() => {
    request.post('/endpoint/', {
      duration,
      id,
    }).then(res => {
      const result: Array<DataPackage> = []; 
      Object.keys(res).forEach(key => {
        switch (key){
          case 'globalBrief':
            result.push({
              label: 'Global Brief',
              type: 'brief', // chart, avgChart, line, info, brief
              unit: '',
              style: { height: '250px', width: '25%' },
              info: res.globalBrief,
            });
            break;
          case 'endpointResponseTime':
            result.push({
              label: 'Endpoint ResponseTime',
              type: 'avgChart',
              unit: 'ms',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'endpointResponseTime', values: res.endpointResponseTime},
                duration
              ),
              avg: res.endpointResponseTime.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Endpoint Arg ResponseTime',
            });
            break;
          case 'endpointThroughput':
            result.push({
              label: 'Endpoint Throughput',
              type: 'avgChart',
              unit: 'cpm',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'endpointThroughput', values: res.endpointThroughput }, 
                duration
              ),
              avg: res.endpointThroughput.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Endpoint Arg Throughput',
            });
            break;
          case 'endpointSLA':
            result.push({
              label: 'Endpoint SLA',
              type: 'avgChart',
              unit: '%',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'endpointSLA', values: res.endpointSLA },
                duration
              ),
              avg: res.endpointSLA.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Endpoint Arg SLA',
            });
            break;
          case 'globalPercentile':
            result.push({
              label: 'Global Response Time Percentile',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToStackLineChart(
                Object.keys(res.globalPercentile).map( key => {
                  return {
                    name: key,
                    values: res.globalPercentile[`${key}`],
                  }
                }), duration),
            });
            break;
          case 'endpointPercentile':
            result.push({
              label: 'Endpoint Response Time Percentile',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToStackLineChart(
                Object.keys(res.endpointPercentile).map(key => {
                  return {
                    name: key,
                    values: res.endpointPercentile[`${key}`],
                  }
                }), duration),
            });
            break;
          case 'endpointTopology':
            result.push({
              label: 'Dependency Map',
              type: 'chart',
              unit: '',
              style: { height: '250px', width: '50%'},
              value: translateToSanKeyChart(res.endpointTopology),
            });
            break;
          case 'globalSlow':
            result.push({
              label: 'Global Top Slow Endpoint',
              type: 'line', // chart, avgChart, line, info, brief
              unit: 'ms',
              style: { height: '250px', width: '50%'},
              value: res.globalSlow,
              color: 'rgb(63, 177, 227)',
            });
            break;
          case 'endpointTraces':
            result.push({
              label: 'Slow Traces',
              type: 'line', // chart, avgChart, line, info, brief
              unit: 'ms',
              style: { height: '250px', width: '50%'},
              value: res.endpointTraces.traces.map((trace: { endpointNames: string[]; id: any; duration: any; }) => {
                return {
                  name: trace.endpointNames[0],
                  id: trace.id,
                  value: trace.duration,
                }
              }), // endpointTraces: {traces: [], total: num } ?
              color: 'rgb(191, 153, 248)',
            });
            break;
          default:
            break;
        }
      });
      setEndpointData(result);
    })
    .catch(e => {
      message.error(e.message);
    });
  }, [refresh, id, duration]);
  return (
    <div
      style={{
        padding: '20px 15px',
      }}
    >
      {
        endpointData.map(item => (
          <PackageCard
            data={item}
          />
        ))
      }
    </div>
  )
};

export default EndpointPanel;