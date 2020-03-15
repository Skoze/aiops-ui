import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import {
  DataPackage, translateToLineChart, ServiceInstancesType, translateToLineAreaChart, translateToStackLineChart, Duration,
} from '../../type';
import PackageCard from '../package-card';
import request from '@/utils/request';
interface IInstancePanelProps{
  refresh: number;
  duration: Duration;
  instance: ServiceInstancesType;
}
const InstancePanel: FC<IInstancePanelProps> = props => {
  const { refresh, duration, instance } = props;
  const [instanceData, setInstanceData] = useState<Array<DataPackage>>([]);
  useEffect(() => {
    request.post('/instance/', {
      duration,
      id: instance.instanceUuid,
    }).then(res => {
      const result: Array<DataPackage> = []; 
      result.push({
        label: 'Instance Info',
        type: 'info', // chart, avgChart, line, info, brief
        unit: '',
        style: { height: '250px', width: '25%' },
        info: instance,
      })
      Object.keys(res).forEach(key => {
        switch (key){
          case 'instanceResponseTime':
            result.push({
              label: 'Instance ResponseTime',
              type: 'avgChart',
              unit: 'ms',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'instanceResponseTime', values: res.instanceResponseTime },
                duration
              ),
              avg: res.instanceResponseTime.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Instance Avg ResponseTime',
            });
            break;
          case 'instanceThroughput':
            result.push({
              label: 'Instance Throughput',
              type: 'avgChart',
              unit: 'cpm',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'instanceThroughput', values: res.instanceThroughput },
                duration
              ),
              avg: res.instanceThroughput.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Instance Arg Throughput',
            });
            break;
          case 'instanceSLA':
            result.push({
              label: 'Instance SLA',
              type: 'avgChart',
              unit: '%',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'instanceSLA', values: res.instanceSLA },
                duration
              ),
              avg: res.instanceSLA.values.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Instance Arg SLA',
            });
            break;
          case 'heap':
            result.push({
              label: 'JVM Heap (MB)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineAreaChart(
                Object.keys(res.heap).map(key => {
                  return {
                    name: key,
                    values: res.heap[`${key}`],
                  }
                }),
                duration
              ),
            });
            break;
          case 'nonHeap':
            result.push({
              label: 'JVM Non-Heap (MB)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineAreaChart(
                Object.keys(res.noHeap).map(key => {
                  return {
                    name: key,
                    values: res.noHeap[`${key}`],
                  };
                }),
                duration
              ),
            });
            break;
          case 'GCTime':
            result.push({
              label: 'JVM GC (ms)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineAreaChart(
                Object.keys(res.GCTime).map(key => {
                  return {
                    name: key,
                    values: res.GCTime[`${key}`],
                  }
                }),
                duration
              ),
            });
            result.push({
              label: 'JVM GC Count',
              type: 'brief',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: {
                youngGCTime: res.GCTime.youngGCTime.length,
                oldGCTime: res.GCTime.oldGCTime.length,
              }
            });
            break;
          case 'instanceCPU':
            result.push({
              label: 'JVM CPU (%)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'cpu' , values: res.instanceCPU },
                duration
              ),
            });
            break;
          case 'clrCPU':
            result.push({
              label: 'CLR CPU (%)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'cpu' , values: res.clrCPU },
                duration
              ),
            });
            break;
            case 'clrGC':
              result.push({
                label: 'CLR GC (Count)',
                type: 'chart',
                unit: '',
                style: {height: '250px', width: '25%'},
                value: translateToStackLineChart(
                  Object.keys(res.clrGC).map(key => {
                    return {
                      name: key,
                      values: res.CLRGC[`${key}`],
                    }
                  }), duration),
                });
              break;
          case 'clrHeap':
            result.push({
              label: 'CLR HeapMemory (MB)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineChart(
                { name: 'clrHeap' , values: res.clrHeap },
                duration
              ),
            });
            break;
        }
      });
      setInstanceData(result);
    })
    .catch(e => {
      message.error(e.message);
    });
  }, [refresh, instance, duration]);
  return (
    <div
      style={{
        padding: '20px 15px',
      }}
    >
      {
        instanceData.map(item => (
          <PackageCard
            data={item}
          />
        ))
      }
    </div>
  );
};
export default InstancePanel;