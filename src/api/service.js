import request from '@/utils/request';

export function getServiceInfo({ duration, id }) {
  return request.post('/service', {
    duration,
    id,
  });
}

export function getServiceApdexScore({ duration, id }) {
  return request.post('/service/apdexScore', {
    duration,
    id,
  });
}
export function getServicePercentile({ duration, id }) {
  return request.post('/service/percentile', {
    duration,
    id,
  });
}
export function getServiceResponseTime({ duration, id }) {
  return request.post('/service/responseTime', {
    duration,
    id,
  });
}
export function getServiceSLA({ duration, id }) {
  return request.post('/service/sla', {
    duration,
    id,
  });
}
export function getServiceThroughput({ duration, id }) {
  return request.post('/service/throughput', {
    duration,
    id,
  });
}
