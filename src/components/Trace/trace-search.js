import React, { useState, useEffect } from 'react';
import { getServices, getServiceInstances, getEndpoints } from '@/api/metadata';
import SelectorBase from '@/components/Base/selector-base';
import FilterBase from '@/components/Base/filter-base';
import DurationPicker from '@/components/DurationPicker';
import { Button, Icon, Input } from 'antd';
import { useDuration } from '@/hooks';
import moment from 'moment';
import styles from './trace-search.css';

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

  console.log('rerender');
  return (
    <div className={styles['container']}>
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
        </div>
        <div>
          <FilterBase label="持续时间">
            <Input.Group compact>
              <Input
                style={{ width: '5em', textAlign: 'center' }}
                value={minTraceDuration || ''}
                onChange={e => setMinTraceDuration(e.target.value)}
              />
              <Input
                style={{
                  width: '1em',
                  textAlign: 'center',
                  paddingLeft: 0,
                  paddingRight: 0,
                  borderLeft: 'none',
                  pointerEvents: 'none',
                  backgroundColor: '#fff',
                }}
                placeholder="~"
                disabled
              />
              <Input
                style={{ width: '5em', borderLeft: 'none', textAlign: 'center' }}
                value={maxTraceDuration || ''}
                onChange={e => setMaxTraceDuration(e.target.value)}
              />
              <Input
                style={{
                  width: '3em',
                  borderLeft: 'none',
                  pointerEvents: 'none',
                  backgroundColor: '#fff',
                }}
                placeholder="ms"
                disabled
              />
            </Input.Group>
          </FilterBase>
          <FilterBase label="时间范围">
            <DurationPicker range={range} changeDuration={changeDuration}></DurationPicker>
          </FilterBase>
        </div>
      </div>
      <div className={styles['options']}>
        <Button
          onClick={() => {
            setServiceId('ALL');
            setTraceState('ALL');
            setMaxTraceDuration(undefined);
            setMinTraceDuration(undefined);
            changeDuration([moment().subtract(15, 'm'), moment()]);
          }}
        >
          <Icon type="delete" />
          <span>清空</span>
        </Button>
        <Button
          onClick={() => {
            onSearch({
              serviceId: serviceId === 'ALL' ? undefined : serviceId,
              serviceInstanceId: serviceInstanceId === 'ALL' ? undefined : serviceInstanceId,
              endpointId: endpointId === 'ALL' ? undefined : endpointId,
              traceState,
              duration,
              minTraceDuration: parseInt(minTraceDuration) || undefined,
              maxTraceDuration: parseInt(maxTraceDuration) || undefined,
            });
          }}
        >
          <Icon type="search" />
          <span>搜索</span>
        </Button>
      </div>
    </div>
  );
}
