import { useState, useEffect, useCallback } from 'react';
import { getServices, getServiceInstances, getEndpoints } from '@/api/metadata';
import SelectorBase from '@/components/Base/selector-base';
import DurationPicker from '@/components/DurationPicker';
import { Button } from 'antd';
import { useDuration } from '@/hooks/index.js';

const defaultService = { name: 'All', id: 'ALL' };
const defaultServiceInstance = { name: 'All', id: 'ALL' };
const defaultEndpoint = { name: 'All', id: 'ALL' };
const traceStates = [
  { name: 'All', id: 'ALL' },
  { name: 'Success', id: 'SUCCESS' },
  { name: 'Error', id: 'ERROR' },
];

export default function TraceSearch({ defaultQuery, onSearch }) {
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
  const { duration, range, refresh, changeDuration } = useDuration(defaultQuery.duration);

  useEffect(() => {
    getServices().then((data) => {
      setServices(data.map((val) => ({ ...val, id: val.serviceId })));
    });
  }, []);
  useEffect(() => {
    let isFetching = true;
    setServiceInstances([]);
    if (serviceId !== defaultService.id) {
      getServiceInstances(serviceId).then((data) => {
        if (isFetching) {
          setServiceInstances(data.map((val) => ({ ...val, id: val.serviceInstanceId })));
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
      getEndpoints(serviceId).then((data) => {
        if (isFetching) {
          setEndpoints(data.map((val) => ({ ...val, id: val.serviceEndpointId })));
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
    refresh();
  }, [refresh]);

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
      <SelectorBase
        label="服务"
        value={serviceId}
        defaultOption={defaultService}
        options={services}
        onChange={setServiceId}
      ></SelectorBase>
      <SelectorBase
        label="实例"
        value={serviceInstanceId}
        defaultOption={defaultServiceInstance}
        options={serviceInstances}
        onChange={setServiceInstanceId}
      ></SelectorBase>
      <SelectorBase
        label="端点"
        value={endpointId}
        defaultOption={defaultEndpoint}
        options={endpoints}
        onChange={setEndpointId}
      ></SelectorBase>
      <SelectorBase
        label="状态"
        value={traceState}
        options={traceStates}
        onChange={setTraceState}
      ></SelectorBase>
      持续时间
      <input
        style={{ maxWidth: '3em' }}
        value={minTraceDuration || ''}
        onChange={(e) => setMinTraceDuration(e.target.value)}
      ></input>
      -
      <input
        style={{ maxWidth: '3em' }}
        value={maxTraceDuration || ''}
        onChange={(e) => setMaxTraceDuration(e.target.value)}
      ></input>
      ms 时间范围
      <DurationPicker range={range} changeDuration={changeDuration}></DurationPicker>
      <Button onClick={clear}>清空</Button>
      <Button onClick={search}>搜索</Button>
    </div>
  );
}
