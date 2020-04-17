export interface WarningFilter {
  scope: string;
  keyword: string;
  pageNum: number;
  total?:number;
};
export interface WarnInfo {
  id: string;
  message: string;
  startTime: number;
  scope: string;
};
export const scopeMap: {
  [key: string]: string
} = {
  All: '全部',
  Service: '服务',
  ServiceInstance: '服务实例',
  Endpoint: '端点',
};
export const scopeColorMap: {
  [key: string]: string
} = {
  All: '#fbb03b',
  Service: '#448dfe',
  ServiceInstance: '#fbb03b',
  Endpoint: '#4caf50',
};
export const scopeOptions = [{
  name: '全部', value: 'All',
}, {
  name: '服务', value: 'Service',
}, {
  name: '服务实例', value: 'ServiceInstance',
}, {
  name: '端点', value: 'Endpoint',
}];
