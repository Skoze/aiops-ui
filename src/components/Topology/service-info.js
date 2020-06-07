import React, { useEffect, useState, useContext, useMemo } from 'react';
import { DurationContext } from '@/layouts';
import { translateToLineChart, translateToStackLineChart } from '@/components/Dashboard/type';
import BriefChart from './brief-chart';
import styles from './service-info.css';
import {
  getServiceInfo,
  // getServiceApdexScore,
  // getServicePercentile,
  // getServiceResponseTime,
  // getServiceSLA,
  // getServiceThroughput,
} from '@/api/service';

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
  // const [serviceApdexScore, setServiceApdexScore] = useState([]);
  // const [servicePercentile, setServicePercentile] = useState([]);
  // const [serviceResponseTime, setServiceResponseTime] = useState([]);
  // const [serviceSLA, setServiceSLA] = useState([]);
  // const [serviceThroughput, setServiceThroughput] = useState([]);
  useEffect(() => {
    let isFetching = true;
    // setServiceApdexScore([]);
    // setServicePercentile([]);
    // setServiceResponseTime([]);
    // setServiceSLA([]);
    // setServiceThroughput([]);
    // getServiceApdexScore({ duration, id }).then(data => {
    //   if (isFetching) {
    //     setServiceApdexScore(data);
    //   }
    // });
    // getServicePercentile({ duration, id }).then(data => {
    //   if (isFetching) {
    //     setServicePercentile(data);
    //   }
    // });
    // getServiceResponseTime({ duration, id }).then(data => {
    //   if (isFetching) {
    //     setServiceResponseTime(data);
    //   }
    // });
    // getServiceSLA({ duration, id }).then(data => {
    //   if (isFetching) {
    //     setServiceSLA(data);
    //   }
    // });
    // getServiceThroughput({ duration, id }).then(data => {
    //   if (isFetching) {
    //     setServiceThroughput(data);
    //   }
    // });
    setServiceInfo(defaultServiceInfo);
    getServiceInfo({ duration, id }).then(data => {
      if (isFetching) {
        setServiceInfo(data);
      }
    });
    return () => {
      isFetching = false;
    };
  }, [duration, id]);

  const serviceApdexScoreOption = useMemo(() => {
    const { serviceApdexScore } = serviceInfo;
    return translateToLineChart({ values: serviceApdexScore }, duration);
  }, [serviceInfo, duration]);
  const serviceSLAScoreOption = useMemo(() => {
    const { serviceSLA } = serviceInfo;
    return translateToLineChart({ values: serviceSLA }, duration);
  }, [serviceInfo, duration]);
  const serviceResponseTimeOption = useMemo(() => {
    const { serviceResponseTime } = serviceInfo;
    return translateToLineChart({ values: serviceResponseTime }, duration);
  }, [serviceInfo, duration]);
  const serviceThroughputOption = useMemo(() => {
    const { serviceThroughput } = serviceInfo;
    return translateToLineChart({ values: serviceThroughput }, duration);
  }, [serviceInfo, duration]);
  const servicePercentileOption = useMemo(() => {
    const { servicePercentile } = serviceInfo;
    return translateToStackLineChart(
      Object.keys(servicePercentile).map(key => {
        return {
          name: key,
          values: servicePercentile[`${key}`],
        };
      }),
      duration,
    );
  }, [serviceInfo, duration]);

  return (
    <div className={styles['container']}>
      <div className={styles['title']}>
        <div className={styles['label']}>服务名称</div>
        <div className={styles['value']}>{name}</div>
        <div className={styles['label']}>类型</div>
        <div className={styles['value']}>{type}</div>
      </div>
      <BriefChart name="Service ApdexScore" option={serviceApdexScoreOption} />
      <BriefChart name="Service Percentile" option={servicePercentileOption} />
      <BriefChart name="Service ResponseTime" option={serviceResponseTimeOption} />
      <BriefChart name="Service SLAScore" option={serviceSLAScoreOption} />
      <BriefChart name="Service Throughput" option={serviceThroughputOption} />
    </div>
  );
};
