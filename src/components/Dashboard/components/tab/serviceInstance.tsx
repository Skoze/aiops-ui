import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import {
  DataPackage, translateToLineChart, ServiceInstancesType, translateToLineAreaChart, translateToStackLineChart, Duration,
} from '../../type';
import PackageCard from '../package-card';
import request from '@/utils/request';
interface IInstancePanelProps{
  duration: Duration;
  instance?: ServiceInstancesType;
}
const InstancePanel: FC<IInstancePanelProps> = props => {
  const {duration, instance } = props;
  const [instanceData, setInstanceData] = useState<Array<DataPackage>>([]);
  useEffect(() => {
    request.post('/instance/', {
      duration,
      id: instance?.serviceInstanceId,
      business: '',
    }).then(res => {
      const result: Array<DataPackage> = []; 
      result.push({
        label: 'Instance Info',
        type: 'info', // chart, avgChart, line, info, brief
        unit: '',
        style: { height: '250px', width: '25%' },
        info: instance,
      });
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
              avg: res.instanceResponseTime.reduce((p: any, c: any) => p + c.value, 0),
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
              avg: res.instanceThroughput.reduce((p: any, c: any) => p + c.value, 0),
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
              avg: res.instanceSLA.reduce((p: any, c: any) => p + c.value, 0),
              avgLabel: 'Instance Arg SLA',
            });
            break;
          case 'heap':
            let heap = [];
            heap.push({
              name: 'Value',
              values: res.heap.map(item => {
                return { value: item.value, predict: item.predict };
              }),
            });
            heap.push({
              name: 'Free',
              values: res.heap.map(item => {
                return { value: item.free, predict: item.predict };
              }),
            });
            result.push({
              label: 'JVM Heap (MB)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineAreaChart(
                heap,
                duration
              ),
            });
            break;
          case 'nonHeap':
            let values = [];
            values.push({
              name: 'Value',
              values: res.nonHeap.map(item => {
                return { value: item.value, predict: item.predict };
              }),
            });
            values.push({
              name: 'Free',
              values: res.nonHeap.map(item => {
                return { value: item.free, predict: item.predict };
              }),
            });
            result.push({
              label: 'JVM Non-Heap (MB)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineAreaChart(
                values,
                duration
              ),
            });
            break;
          case 'gcTime':
            result.push({
              label: 'JVM GC (ms)',
              type: 'chart',
              unit: '',
              style: {height: '250px', width: '25%'},
              value: translateToLineAreaChart(
                Object.keys(res.gcTime).map(key => {
                  return {
                    name: key,
                    values: res.gcTime[`${key}`],
                  }
                }),
                duration
              ),
            });
            break;
          case 'gcCount':
            result.push({
              label: 'JVM GC Count',
              type: 'brief',
              unit: '',
              style: {height: '250px', width: '25%'},
              info: {
                youngGCTime: res.gcCount.oldGCCount.reduce((p: any, c: any) => p + c.value, 0),
                oldGCTime: res.gcCount.youngGCCount.reduce((p: any, c: any) => p + c.value, 0),
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
                      values: res.clrGC[`${key}`],
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
  }, [instance, duration]);
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