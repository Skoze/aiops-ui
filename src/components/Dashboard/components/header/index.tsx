import React, { FC } from 'react';
import { Card } from 'antd';
import { DashBoardFilter, ServiceInstancesType, EndpointsType, ServicesType, DatabaseType } from '../../type';
import DropDownSelect from './dropdown';
interface IDashBoardHeaderProps{
  filter: DashBoardFilter;
  services?: Array<ServicesType>;
  databases?: Array<DatabaseType>;
  endpoints?: Array<EndpointsType>;
  serviceInstances?: Array<ServiceInstancesType>;
	onFilterChange: (type: string, value: string) => void;
}
const DashBoardHeader: FC<IDashBoardHeaderProps> = props => {
  const {
    filter, services = [], endpoints = [], serviceInstances = [], databases = [], onFilterChange,
  } = props;
  const types = [{
    id: '1',
    name: 'Service'
  }, {
    id: '2',
    name: 'Database'
  }];
  return (
    <Card className="dashboard-header">
      <DropDownSelect
        choises={types}
        onChange={onFilterChange}
        type={'type'}
        idName={'id'}
        target={filter.type || '1'}
      />
      {
        filter.type === '1' &&
        <DropDownSelect
          choises={services}
          onChange={onFilterChange}
          type={'service'}
          idName={'serviceId'}
          target={filter.service || String(services[0]?.serviceId)}
        />
      }
      {
        filter.type === '1' &&
        <DropDownSelect
          choises={endpoints}
          onChange={onFilterChange}
          type={'endpoint'}
          idName={'serviceEndpointId'}
          target={filter.endpoint || String(endpoints[0]?.serviceEndpointId)}
        />
      }
      {
        filter.type === '1' &&
        <DropDownSelect
          choises={serviceInstances}
          onChange={onFilterChange}
          type={'serviceInstance'}
          idName={'serviceInstanceId'}
          target={filter.serviceInstance || String(serviceInstances[0]?.serviceInstanceId)}
        />
      }
      {
        filter.type === '2' &&
        <DropDownSelect
          choises={databases}
          onChange={onFilterChange}
          type={'database'}
          idName={'databaseId'}
          target={filter.database || String(databases[0]?.databaseId)}
        />
      }
    </Card>
  );
};
export default DashBoardHeader;