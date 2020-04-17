import request from '@/utils/request';
export function getServices() {
  return request.get('/metadata/getServices');
}
export function getServiceInstances(serviceId) {
  return request.get('/metadata/getServiceInstances', { service_id: serviceId });
}
export function getEndpoints(serviceId) {
  return request.get('/metadata/getEndpoints', { service_id: serviceId });
}
