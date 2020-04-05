import request from '@/utils/request';

export function trace({
  duration,
  endpointId,
  maxTraceDuration,
  minTraceDuration,
  paging,
  queryOrder,
  serviceId,
  serviceInstanceId,
  traceState,
}) {
  return request.post('/trace/trace', {
    duration,
    endpointId,
    maxTraceDuration,
    minTraceDuration,
    paging,
    queryOrder,
    serviceId,
    serviceInstanceId,
    traceState,
  });
}
