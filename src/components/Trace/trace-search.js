import { useState, useEffect, useCallback } from 'react';
import { getServices, getServiceInstances, getEndpoints } from '@/api/metadata';
import SelectorBase from '@/components/Base/selector-base';
import FilterBase from '@/components/Base/filter-base';
import DurationPicker from '@/components/DurationPicker';
import { Button } from 'antd';
import { useDuration } from '@/hooks/index.js';
import moment from 'moment';

const defaultService = { name: 'All', id: 'ALL' };
const defaultServiceInstance = { name: 'All', id: 'ALL' };
const defaultEndpoint = { name: 'All', id: 'ALL' };
const traceStates = [
  { name: 'All', id: 'ALL' },
  { name: 'Success', id: 'SUCCESS' },
  { name: 'Error', id: 'ERROR' },
];

export default function TraceSearch({ defaultQuery, defaultRange, onSearch }) {
  const [services, setServices] = useState([]);
  const [serviceInstances, setServiceInstances] = useState([]);
  const [endpoints, setEndpoints] = useState([]);

  const [serviceId, setServiceId] = useState(defaultQuery.serviceId || defaultService.id);
  const [serviceInstanceId, setServiceInstanceId] = useState(
    defaultQuery.serviceInstanceId || defaultServiceInstance.id,
  );
  const [endpointId, setEndpointId] = useState(defaultQuery.endpointId || defaultEndpoint.id);
  const [traceState, setTraceState] = useState(defaultQuery.traceState || 'ALL');
  const [maxTraceDuration, setMaxTraceDuration] = useState(defaultQuery.maxTraceDuration);
  const [minTraceDuration, setMinTraceDuration] = useState(defaultQuery.minTraceDuration);
  const { duration, range, changeDuration } = useDuration(defaultRange || defaultQuery.duration);

  useEffect(() => {
    getServices().then(data => {
      setServices(data.map(val => ({ ...val, id: val.serviceId })));
    });
  }, []);
  useEffect(() => {
    let isFetching = true;
    setServiceInstances([]);
    if (serviceId !== defaultService.id) {
      getServiceInstances(serviceId).then(data => {
        if (isFetching) {
          setServiceInstances(data.map(val => ({ ...val, id: val.serviceInstanceId })));
        }
      });
    }
    return () => {
      isFetching = false;
    };
  }, [serviceId]);

  useEffect(() => {
    let isFetching = true;
    setEndpoints([]);
    if (serviceId !== defaultService.id) {
      getEndpoints(serviceId).then(data => {
        if (isFetching) {
          setEndpoints(data.map(val => ({ ...val, id: val.serviceEndpointId })));
        }
      });
    }
    return () => {
      isFetching = false;
    };
  }, [serviceId]);

  const clear = useCallback(() => {
    setServiceId('ALL');
    setTraceState('ALL');
    setMaxTraceDuration();
    setMinTraceDuration();
    changeDuration([moment().subtract(15, 'm'), moment()]);
  }, [changeDuration]);

  const search = useCallback(() => {
    onSearch({
      serviceId: serviceId === 'ALL' ? undefined : serviceId,
      serviceInstanceId: serviceInstanceId === 'ALL' ? undefined : serviceInstanceId,
      endpointId: endpointId === 'ALL' ? undefined : endpointId,
      traceState,
      duration,
      minTraceDuration: parseInt(minTraceDuration) || undefined,
      maxTraceDuration: parseInt(maxTraceDuration) || undefined,
    });
  }, [
    serviceId,
    serviceInstanceId,
    endpointId,
    traceState,
    duration,
    minTraceDuration,
    maxTraceDuration,
    onSearch,
  ]);

  return (
    <div>
      <div>
        <FilterBase label="服务">
          <SelectorBase
            value={serviceId}
            defaultOption={defaultService}
            options={services}
            onChange={setServiceId}
          ></SelectorBase>
        </FilterBase>
        <FilterBase label="实例">
          <SelectorBase
            value={serviceInstanceId}
            defaultOption={defaultServiceInstance}
            options={serviceInstances}
            onChange={setServiceInstanceId}
          ></SelectorBase>
        </FilterBase>
        <FilterBase label="端点">
          <SelectorBase
            value={endpointId}
            defaultOption={defaultEndpoint}
            options={endpoints}
            onChange={setEndpointId}
          ></SelectorBase>
        </FilterBase>
        <FilterBase label="状态">
          <SelectorBase
            value={traceState}
            options={traceStates}
            onChange={setTraceState}
          ></SelectorBase>
        </FilterBase>
        <Button onClick={clear}>清空</Button>
        <Button onClick={search}>搜索</Button>
      </div>
      <div>
        <FilterBase label="持续时间">
          <input
            style={{ maxWidth: '3em' }}
            value={minTraceDuration || ''}
            onChange={e => setMinTraceDuration(e.target.value)}
          ></input>
          -
          <input
            style={{ maxWidth: '3em' }}
            value={maxTraceDuration || ''}
            onChange={e => setMaxTraceDuration(e.target.value)}
          ></input>
          ms
        </FilterBase>
        <FilterBase label="时间范围">
          <DurationPicker range={range} changeDuration={changeDuration}></DurationPicker>
        </FilterBase>
      </div>
    </div>
  );
}
