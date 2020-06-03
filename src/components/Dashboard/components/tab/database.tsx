import React, { FC, useEffect, useState } from 'react';
import {
  DataPackage, translateToLineChart, translateToStackLineChart, Duration,
} from '../../type';
import PackageCard from '../package-card';
import { message } from 'antd';
import request from '@/utils/request';
interface IDatabasePanelProps{
  duration: Duration;
  id?: string;
}
const DatabasePanel: FC<IDatabasePanelProps> = props => {
  const { duration, id = '' } = props;
  const [databaseData, setDatabaseData] = useState<Array<DataPackage>>([]);
  useEffect(() => {
    request.post('/database/', {
      duration,
      id,
      business: '',
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
          case 'databaseResponseTime':
            result.push({
              label: 'Database ResponseTime',
              type: 'avgChart',
              unit: 'ms',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'databaseResponseTime', values: res.databaseResponseTime },
                duration
              ),
              avg: res.databaseResponseTime.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Database Arg ResponseTime',
            })
            break;
          case 'databaseThroughput':
            result.push({
              label: 'Database Throughput',
              type: 'avgChart',
              unit: 'cpm',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'databaseThroughput', values: res.databaseThroughput },
                duration
              ),
              avg: res.databaseThroughput.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Database Arg Throughput',
            });
            break;
          case 'databaseSLA':
            result.push({
              label: 'Database SLA',
              type: 'avgChart',
              unit: '%',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'databaseSLA', values: res.databaseSLA },
                duration
              ),
              avg: res.databaseSLA.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Database Avg SLA',
            });
            break;
          case 'globalPercentile':
            result.push({
              label: 'Global Response Time Percentile',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToStackLineChart(
                Object.keys(res.globalPercentile).map(key => {
                  return {
                    name: key,
                    values: res.globalPercentile[`${key}`],
                  }
                }), duration),
            });
            break;
          case 'databasePercentile':
            result.push({
              label: 'Database Response Time Percentile',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToStackLineChart(
                Object.keys(res.databasePercentile).map(key => {
                  return {
                    name: key,
                    values: res.databasePercentile[`${key}`],
                  }
                }), duration),
            });
            break;
          case 'databaseTopNRecords':
            result.push({
              label: 'Service Slow Endpoint',
              type: 'line', // chart, avgChart, line, info, brief
              unit: 'ms',
              style: { height: '250px', width: '50%'},
              value: res.databaseTopNRecords.map((record: { statement: any; traceId: any; latency: any; }) => {
                return {
                  name: record.statement,
                  id: record.traceId,
                  value: record.latency,
                }
              }),
              color: 'rgb(63, 177, 227)',
            });
            break;
          default:
            break;
        }});
        setDatabaseData(result);
    })
    .catch(e => {
      message.error(e.message);
    });
  }, [duration, id]);
  return (
    <div
      style={{
        padding: '20px 15px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {
        databaseData.map(item => (
          <PackageCard
            data={item}
          />
        ))
      }
    </div>
  );
};
export default DatabasePanel;