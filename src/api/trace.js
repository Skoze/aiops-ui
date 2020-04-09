import request from '@/utils/request';

export function getTraces({
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

export function getSpans({ traceId }) {
  return request.get('/trace/span', { traceId });
}
