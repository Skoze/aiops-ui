export default {
  'POST /aiops/trace/trace': {
    total: 5,
    traces: [
      {
        endpointNames: ['/projectC/{value}'],
        duration: 62211,
        start: '1585821752894',
        isError: false,
        id: '1585821751836.67796388.91842',
      },
      {
        endpointNames: ['/projectC/{value}'],
        duration: 62150,
        start: '1585822075256',
        isError: false,
        id: '1585822075153.398272509.16846',
      },
      {
        endpointNames: ['/projectA/test'],
        duration: 8214,
        start: '1585821841919',
        isError: false,
        id: '1585821841919.862520767.41999',
      },
      {
        endpointNames: ['/projectA/test'],
        duration: 8137,
        start: '1585822111718',
        isError: false,
        id: '1585822111718.641466163.97363',
      },
      {
        endpointNames: ['org.skywalking.springcloud.test.projectd.MessageConsumer.consumer()'],
        duration: 3,
        start: '1585822016701',
        isError: false,
        id: '1585822011592.669693347.16819',
      },
    ],
  },
};
