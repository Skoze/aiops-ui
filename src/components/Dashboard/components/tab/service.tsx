import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import { DataPackage, translateToLineChart, translateToStackLineChart, Duration } from '../../type';
import PackageCard from '../package-card';
import request from '@/utils/request';
interface IServicePanelProps{
  duration: Duration;
  id?: string;
  }
const ServicePanel: FC<IServicePanelProps> = props => {
  const {duration, id = '' } = props;
  const [serviceData, setServiceData] = useState<Array<DataPackage>>([]);
  useEffect(() => {
    request.post('/service/', {
      duration,
      id,
    }).then(res => {
      const result: Array<DataPackage> = [];
      Object.keys(res).forEach(key => {
        switch (key){
          case 'serviceApdexScore':
            result.push({
              label: 'Service ApdexScore',
              type: 'avgChart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'serviceApdexScore', values: res.serviceApdexScore },
                duration
              ),
              avg: res.serviceApdexScore.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Service Avg ApdexScore',
            });
            break;
          case 'serviceResponseTime':
            result.push({
              label: 'Service ResponseTime',
              type: 'avgChart',
              unit: 'ms',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'serviceResponseTime', values: res.serviceResponseTime },
                duration
              ),
              avg: res.serviceResponseTime.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Service Avg ResponseTime',
            })
            break;
          case 'serviceThroughput':
            result.push({
              label: 'Service ResponseTime',
              type: 'avgChart',
              unit: 'cpm',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'serviceResponseTime' , values: res.serviceResponseTime },
                duration
              ),
              avg: res.serviceResponseTime.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Service Avg ResponseTime',
            });
            break;
          case 'serviceSLA':
            result.push({
              label: 'Service SLA',
              type: 'avgChart',
              unit: '%',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'serviceSLA', values: res.serviceSLA },
                duration
              ),
              avg: res.serviceSLA.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Service Avg SLA',
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
          case 'servicePercentile':
            result.push({
              label: 'Service Response Time Percentile',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToStackLineChart(
                Object.keys(res.servicePercentile).map(key => {
                  return {
                    name: key,
                    values: res.servicePercentile[`${key}`],
                  }
                }), duration),
            });
            break;
          case 'serviceSlowEndpoint':
            result.push({
              label: 'Service Slow Endpoint',
              type: 'line', // chart, avgChart, line, info, brief
              unit: 'ms',
              style: { height: '250px', width: '25%'},
              value: res.serviceSlowEndpoint,
              color: 'rgb(63, 177, 227)',
            });
            break;
          case 'serviceInstanceThroughput':
            result.push({
              label: 'Running ServiceInstance',
              type: 'line', // chart, avgChart, line, info, brief
              unit: 'ms',
              style: { height: '250px', width: '50%'},
              value: res.serviceInstanceThroughput,
              color: 'rgb(191, 153, 248)',
            });
            break;
          default:
            break;
        }
      });
      setServiceData(result);
    })
    .catch(e => {
      message.error(e.message);
    });
  }, [duration, id]);
  return (
    <div
      style={{
        padding: '20px 15px',
      }}
    >
      {
        serviceData.map(item => (
          <PackageCard
            data={item}
          />
        ))
      }
    </div>
  )
}

export default ServicePanel;