import React, { FC, useState, useEffect } from 'react';
import { Tabs, message } from 'antd';
import _ from 'lodash';
import DashBoardHeader from '@/components/Dashboard/components/header';
import { DashBoardFilter, Duration, ServiceInstancesType } from '@/components/Dashboard/type';
import request from '@/utils/request';
import Global from '@/components/Dashboard/components/tab/global';
import ServicePanel from '@/components/Dashboard/components/tab/service';
import DatabasePanel from '@/components/Dashboard/components/tab/database';
import InstancePanel from '@/components/Dashboard/components/tab/serviceInstance';
import EndpointPanel from '@/components/Dashboard/components/tab/endpoint';
interface IDashboardProps{
  duration: Duration;
  refresh: number;
}
const Dashboard: FC<IDashboardProps> = props => {
  const { duration, refresh } = props;
  const [filter, setFilter] = useState();
  const [selectedIds, setSelectedIds] = useState();
  const [services, setServices] = useState();
  const [databases, setDatabases] = useState();
  const [endpoints, setEndpoints] = useState();
  const [serviceInstances, setServiceInstances] = useState();
  const onFilterChange = (type: string, value: string) => {
    let tempFilter: DashBoardFilter = { type: filter.type };
    switch(type) {
      case 'type':
        tempFilter.type = value;
        break;
      case 'service':
        tempFilter.service = value;
        requestHeader(value);
        break;
      case 'endpoint':
        tempFilter.endpoint = value;
        break;
      case 'serviceInstance':
        tempFilter.serviceInstance = value;
        break;
      case 'database':
        tempFilter.database = value;
        break;
      default:
        break;
    }
    setFilter(tempFilter);
    setSelectedIds({...selectedIds, ...tempFilter});
  }
  useEffect(() => {
    Promise.all([
      request.get('/metadata/getDatabases'),
      request.get('/metadata/getServices'),
    ]).then(res => {
      setDatabases(res[0]);
      setServices(res[1]);
      setSelectedIds({service: res[0][0].databaseId, database: res[1][0].serviceId })
      Promise.all([
        request.get('/metadata/getEndpoints', { service_id: res[1][0].serviceId }),
        request.get('/metadata/getServiceInstances', { service_id: res[1][0].serviceId }),
      ]).then(response => {
        setEndpoints(response[0]);
        setServiceInstances(response[1]);
        setSelectedIds({endpoint: res[0][0].serviceEndpointId, serviceInstance: res[1][0].instanceUuid })
      }).catch(e => {
        message.error(e.message);
      })
    }).catch(e => {
      message.error(e.message);
    });
  }, []);
  const requestHeader = (id: string) => {
    Promise.all([
      request.get('/metadata/getEndpoints', { service_id: id }),
      request.get('/metadata/getServiceInstances', { service_id: id }),
    ]).then(res => {
      setEndpoints(res[0]);
      setServiceInstances(res[1]);
    }).catch(e => {
      message.error(e.message);
    })
  }
  const onTabChange = (key: string) => {
    switch (key) {
      case '1-2':
        setFilter({ type: '1', service: selectedIds.service });
        break;
      case '1-3':
        setFilter({ type: '1', endpoint: selectedIds.endpoint});
        break;
      case '1-4':
        setFilter({ type: '1', serviceInstance: selectedIds.serviceInstance});
        break;
      case '2-2':
        setFilter({ type: '2', database: selectedIds.database});
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <DashBoardHeader
        filter={filter}
        services={services}
        databases={databases}
        endpoints={endpoints}
        serviceInstances={serviceInstances}
        onFilterChange={onFilterChange}
      />
      { filter.type === '1'
        && <Tabs defaultActiveKey="1-1" onChange={onTabChange}>
        <Tabs.TabPane tab="Global" key="1-1">
        {
          filter.hasOwnProperty('type') &&
          <Global
            refresh={refresh}
            duration={duration}
            id={filter?.type}
          />
        }
        </Tabs.TabPane>
        <Tabs.TabPane tab="Service" key="1-2">
          {
            filter.hasOwnProperty('service') &&
            <ServicePanel
              refresh={refresh}
              duration={duration}
              id={filter?.service}
            />
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="Endpoint" key="1-3">
          {
            filter.hasOwnProperty('endpoint') &&
            <EndpointPanel
              refresh={refresh}
              duration={duration}
              id={filter?.endpoint}
            />
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="Instance" key="1-4">
        {
          filter.hasOwnProperty('type') &&
          <InstancePanel
            refresh={refresh}
            duration={duration}
            instance={_.find(serviceInstances, (instance: ServiceInstancesType) => instance.instanceUuid === filter?.endpoint)}
          />
        }
      </Tabs.TabPane>
      </Tabs>
      }
      {
        filter.type === '2'
        && <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <Tabs.TabPane tab="Global" key="2-1">
            {
              filter.hasOwnProperty('type') &&
              <Global
                refresh={refresh}
                duration={duration}
                id={filter?.type}
              />
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="Database" key="2-2">
          {
              filter.hasOwnProperty('database') &&
              <DatabasePanel
                refresh={refresh}
                duration={duration}
                id={filter?.database}
              />
            }
          </Tabs.TabPane>
        </Tabs>
      } 
    </div>
  );
};
export default Dashboard;