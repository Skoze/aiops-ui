import React, { useEffect, useState, useContext } from 'react';
import { DurationContext } from '@/layouts';
import { translateToLineChart, translateToStackLineChart } from '@/components/Dashboard/type';
import BriefChart from './brief-chart';
import styles from './service-info.css';
import { getServiceInfo } from '@/api/service';

const defaultServiceInfo = {
  serviceApdexScore: [],
  servicePercentile: {},
  serviceResponseTime: [],
  serviceSLA: [],
  serviceThroughput: [],
};
export default ({ service }) => {
  const { id, name, type } = service;
  const { duration } = useContext(DurationContext);
  const [serviceInfo, setServiceInfo] = useState(defaultServiceInfo);
  useEffect(() => {
    let isFetching = true;
    setServiceInfo(defaultServiceInfo);
    getServiceInfo({ duration, id }).then(data => {
      if (isFetching) {
        isFetching = false;
        setServiceInfo(data);
      }
    });
    return () => {
      isFetching = false;
    };
  }, [duration, id]);

  return (
    <div className={styles['container']}>
      <div className={styles['title']}>
        <div className={styles['label']}>服务名称</div>
        <div className={styles['value']}>{name}</div>
        <div className={styles['label']}>类型</div>
        <div className={styles['value']}>{type}</div>
      </div>
      <BriefChart
        name="Service ApdexScore"
        option={translateToLineChart({ values: serviceInfo.serviceApdexScore }, duration)}
      />
      <BriefChart
        name="Service Percentile"
        option={translateToStackLineChart(
          Object.keys(serviceInfo.servicePercentile).map(key => {
            return {
              name: key,
              values: serviceInfo.servicePercentile[`${key}`],
            };
          }),
          duration,
        )}
      />
      <BriefChart
        name="Service ResponseTime"
        option={translateToLineChart({ values: serviceInfo.serviceResponseTime }, duration)}
      />
      <BriefChart
        name="Service SLAScore"
        option={translateToLineChart({ values: serviceInfo.serviceSLA }, duration)}
      />
      <BriefChart
        name="Service Throughput"
        option={translateToLineChart({ values: serviceInfo.serviceThroughput }, duration)}
      />
    </div>
  );
};
