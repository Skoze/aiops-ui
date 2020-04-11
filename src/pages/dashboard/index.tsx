import React, { FC, useState, useEffect, useContext } from 'react';
import { Tabs, message, Card } from 'antd';
import _ from 'lodash';
import DashBoardHeader from '@/components/Dashboard/components/header';
import { DashBoardFilter, ServiceInstancesType } from '@/components/Dashboard/type';
import request from '@/utils/request';
import Global from '@/components/Dashboard/components/tab/global';
import ServicePanel from '@/components/Dashboard/components/tab/service';
import DatabasePanel from '@/components/Dashboard/components/tab/database';
import InstancePanel from '@/components/Dashboard/components/tab/serviceInstance';
import EndpointPanel from '@/components/Dashboard/components/tab/endpoint';
import { DurationContext } from '@/layouts';
import './index.less';
interface IDashboardProps {

}
const Dashboard: FC<IDashboardProps> = props => {
  const { duration } = useContext(DurationContext);
  const [filter, setFilter] = useState<DashBoardFilter>({ type: '1'});
  const [selectedIds, setSelectedIds] = useState<DashBoardFilter>();
  const [services, setServices] = useState();
  const [databases, setDatabases] = useState();
  const [endpoints, setEndpoints] = useState();
  const [serviceInstances, setServiceInstances] = useState();
  const onFilterChange = (type: string, value: string) => {
    let tempFilter: DashBoardFilter = { type: filter.type };
    switch (type) {
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
    setSelectedIds({ ...selectedIds, ...tempFilter });
  };
  useEffect(() => {
    Promise.all([
      request.get('/metadata/getDatabases'),
      request.get('/metadata/getServices'),
    ])
    .then(res => {
      setDatabases(res[0]);
      setServices(res[1]);
      setSelectedIds({ ...selectedIds, database: res[0][0].databaseId, service: res[1][0].serviceId })
      Promise.all([
        request.get('/metadata/getEndpoints', { service_id: res[1][0].serviceId }),
        request.get('/metadata/getServiceInstances', { service_id: res[1][0].serviceId }),
      ])
      .then(response => {
        setEndpoints(response[0]);
        setServiceInstances(response[1]);
        setSelectedIds({ ...selectedIds, endpoint: res[0][0].serviceEndpointId, serviceInstance: res[1][0].serviceInstanceId })
      })
      .catch(e => {
          message.error(e.message);
      });
    })
    .catch(e => {
      message.error(e.message);
    });
  }, [selectedIds]);
  const requestHeader = (id: string) => {
    Promise.all([
      request.get('/metadata/getEndpoints', { service_id: id }),
      request.get('/metadata/getServiceInstances', { service_id: id }),
    ])
      .then(res => {
        setEndpoints(res[0]);
        setServiceInstances(res[1]);
      })
      .catch(e => {
        message.error(e.message);
      });
  };
  const onTabChange = (key: string) => {
    switch (key) {
      case '1-2':
        setFilter({ type: '1', service: selectedIds?.service });
        break;
      case '1-3':
        setFilter({ type: '1', endpoint: selectedIds?.endpoint});
        break;
      case '1-4':
        setFilter({ type: '1', serviceInstance: selectedIds?.serviceInstance});
        break;
      case '2-2':
        setFilter({ type: '2', database: selectedIds?.database});
        break;
      default:
        break;
    }
  };
  return (
    <div className="dashboard">
      <DashBoardHeader
        filter={filter}
        services={services}
        databases={databases}
        endpoints={endpoints}
        serviceInstances={serviceInstances}
        onFilterChange={onFilterChange}
      />
      <Card>
      { filter.type === '1'
        && <Tabs defaultActiveKey="1-1" onChange={onTabChange}>
        <Tabs.TabPane tab="Global" key="1-1" className="dashboard-tabpane">
        {
          filter.hasOwnProperty('type') &&
          <Global
            duration={duration}
            id={filter?.type}
          />
        }
        </Tabs.TabPane>
        <Tabs.TabPane tab="Service" key="1-2" className="dashboard-tabpane">
          {
            filter.hasOwnProperty('service') &&
            <ServicePanel
              duration={duration}
              id={filter.service}
            />
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="Endpoint" key="1-3" className="dashboard-tabpane">
          {
            filter.hasOwnProperty('endpoint') &&
            <EndpointPanel
              duration={duration}
              id={filter.endpoint}
            />
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="Instance" key="1-4" className="dashboard-tabpane">
        {
          filter.hasOwnProperty('type') &&
          <InstancePanel
            duration={duration}
            instance={_.find(serviceInstances, (instance: ServiceInstancesType) => String(instance.serviceInstanceId) === filter?.endpoint)}
          />
        }
      </Tabs.TabPane>
      </Tabs>
      }
      {
        filter.type === '2'
        && <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <Tabs.TabPane tab="Global" key="2-1" className="dashboard-tabpane">
            {
              filter.hasOwnProperty('type') &&
              <Global
                duration={duration}
                id={filter?.type}
              />
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="Database" key="2-2" className="dashboard-tabpane">
          {
              filter.hasOwnProperty('database') &&
              <DatabasePanel
                duration={duration}
                id={filter.database}
              />
            }
          </Tabs.TabPane>
        </Tabs>
      }
      </Card>
    </div>
  );
};
export default Dashboard;