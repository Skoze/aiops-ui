import request from '@/utils/request';

export function getTopology(duration) {
  return request.post('/topology/topology', {
    duration,
  });
}
