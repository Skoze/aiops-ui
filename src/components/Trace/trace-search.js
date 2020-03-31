import { useState, useEffect, useCallback, useReducer } from 'react';
import { getServices, getServiceInstances, getEndpoints } from '@/api/metadata';
import SelectorBase from '@/components/Base/selector-base';
import DurationPicker from '@/components/DurationPicker';
import { Button } from 'antd';
import { useDuration } from '@/hooks/index.js';

const defaultServices = { name: 'All', id: 'all' };
const defaultServiceInstances = { name: 'All', id: 'all' };
const defaultEndpoints = { name: 'All', id: 'all' };
const traceStates = [
  { name: 'All', id: 'ALL' },
  { name: 'Success', id: 'SUCCESS' },
  { name: 'Error', id: 'ERROR' },
];

const defaultServiceId = defaultServices.id;
const defaultServiceInstanceId = defaultServiceInstances.id;
const defaultEndpointId = defaultEndpoints.id;

const loadingReducer = (v, type) => {
  switch (type) {
    case 'startAsync':
      return v + 1;
    case 'endAsync':
      return v - 1;
    default:
      return v;
  }
};
export default function TraceSearch({ onSearch }) {
  const [services, setServices] = useState([defaultServices]);
  const [serviceInstances, setServiceInstances] = useState([defaultServiceInstances]);
  const [endpoints, setEndpoints] = useState([defaultEndpoints]);

  const [serviceId, setServiceId] = useState(defaultServiceId);
  const [serviceInstanceId, setServiceInstanceId] = useState(defaultServiceInstanceId);
  const [endpointId, setEndpointId] = useState(defaultEndpointId);
  const [traceState, setTraceState] = useState('ALL');
  const [maxTraceDuration, setMaxTraceDuration] = useState();
  const [minTraceDuration, setMinTraceDuration] = useState();
  const { duration, range, refresh, changeDuration } = useDuration();

  const [loading, dispatchLoading] = useReducer(loadingReducer, 0);

  useEffect(() => {
    async function fetchServices() {
      setServices([]);
      const data = await getServices();
      if (Array.isArray(data)) {
        setServices([defaultServices, ...data.map(val => ({ ...val, id: val.serviceId }))]);
      } else {
        setServices([defaultServices]);
      }
    }
    fetchServices();
  }, []);
  useEffect(() => {
    let isFetching = false;
    async function fetchServiceInstances() {
      if (serviceId !== defaultServiceId) {
        isFetching = true;
        dispatchLoading('startAsync');
        setServiceInstances([]);
        const data = await getServiceInstances(serviceId);
        if (isFetching) {
          if (Array.isArray(data)) {
            setServiceInstances([
              defaultServiceInstances,
              ...data.map(val => ({ ...val, id: val.serviceInstanceId })),
            ]);
          } else {
            setServiceInstances([defaultServiceInstances]);
          }
          isFetching = false;
          dispatchLoading('endAsync');
        }
      } else {
        setServiceInstances([defaultServiceInstances]);
      }
    }
    fetchServiceInstances();
    return () => {
      isFetching && dispatchLoading('endAsync');
      isFetching = false;
    };
  }, [serviceId]);

  useEffect(() => {
    let isFetching = false;
    async function fetchEndpoints() {
      if (serviceId !== defaultServiceId) {
        isFetching = true;
        dispatchLoading('startAsync');
        setEndpoints([]);
        const data = await getEndpoints(serviceId);
        if (isFetching) {
          if (Array.isArray(data)) {
            setEndpoints([
              defaultEndpoints,
              ...data.map(val => ({ ...val, id: val.serviceEndpointId })),
            ]);
          } else {
            setEndpoints([defaultEndpoints]);
          }
          isFetching = false;
          dispatchLoading('endAsync');
        }
      } else {
        setEndpoints([defaultEndpoints]);
      }
    }
    fetchEndpoints();
    return () => {
      isFetching && dispatchLoading('endAsync');
      isFetching = false;
    };
  }, [serviceId]);

  const clear = useCallback(() => {
    setServiceId('all');
    setTraceState('ALL');
    setMaxTraceDuration();
    setMinTraceDuration();
    refresh();
  }, [refresh]);

  const search = useCallback(() => {
    const query = {
      serviceId: serviceId === 'all' ? undefined : serviceId,
      serviceInstanceId: serviceInstanceId === 'all' ? undefined : serviceInstanceId,
      endpointId: endpointId === 'all' ? undefined : endpointId,
      traceState,
      duration,
      minTraceDuration: parseInt(minTraceDuration) || undefined,
      maxTraceDuration: parseInt(maxTraceDuration) || undefined,
    };
    console.log(query);
  }, [
    serviceId,
    serviceInstanceId,
    endpointId,
    traceState,
    duration,
    minTraceDuration,
    maxTraceDuration,
  ]);

  return (
    <div>
      <SelectorBase
        label="服务"
        value={serviceId}
        options={services}
        onChange={setServiceId}
      ></SelectorBase>
      <SelectorBase
        label="实例"
        value={serviceInstanceId}
        options={serviceInstances}
        onChange={setServiceInstanceId}
      ></SelectorBase>
      <SelectorBase
        label="端点"
        value={endpointId}
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
        onChange={e => setMinTraceDuration(e.target.value)}
      ></input>
      -
      <input
        style={{ maxWidth: '3em' }}
        value={maxTraceDuration || ''}
        onChange={e => setMaxTraceDuration(e.target.value)}
      ></input>
      ms 时间范围
      <DurationPicker range={range} changeDuration={changeDuration}></DurationPicker>
      <Button disabled={loading} onClick={clear}>
        清空
      </Button>
      <Button disabled={loading} onClick={search}>
        搜索
      </Button>
    </div>
  );
}
