export default {
  'GET /aiops/metadata/getServices': [
    { serviceId: '2', name: 'load balancer2.system' },
    { serviceId: '4', name: 'projectB.business-zone' },
    { serviceId: '3', name: 'load balancer1.system' },
  ],
  'GET /aiops/metadata/getServiceInstances': (req, res) => {
    let response;
    switch (String(req.query.service_id)) {
      case '2':
        response = [{ 
          serviceInstanceId: '2', 
          name: 'load balancer2.system', 
          language: "JAVA",
          attributes:[
            {"name":"OS Name","value":"Linux"},
            {"name":"hostname","value":"skywalking-server-0002"},
            {"name":"Process No.","value":"2481"},
            {"name":"ipv4s","value":"192.168.252.13"}
          ]
        }];
        break;
      case '3':
        response = [{
          serviceInstanceId: '3',
          name: 'load balancer1.system',
          language: "JAVA",
          attributes:[
            {"name":"OS Name","value":"Linux"},
            {"name":"hostname","value":"skywalking-server-0002"},
            {"name":"Process No.","value":"2481"},
            {"name":"ipv4s","value":"192.168.252.13"}
          ]
        }];
        break;
      case '4':
        response = [
          {
            serviceInstanceId: '17',
            name: 'projectB.business-zone-pid:20233@skywalking-server-0002',
            language: "JAVA",
            attributes:[
              {"name":"OS Name","value":"Linux"},
              {"name":"hostname","value":"skywalking-server-0002"},
              {"name":"Process No.","value":"2481"},
              {"name":"ipv4s","value":"192.168.252.13"}
            ]
          },
        ];
        break;
      default:
        response = [];
        break;
    }
    res.end(JSON.stringify(response));
  },
  'GET /aiops/metadata/getEndpoints': (req, res) => {
    let response;
    switch (String(req.query.service_id)) {
      case '2':
        response = [
          { serviceEndpointId: '2_Lw==_0', name: '/' },
          { serviceEndpointId: '2_L2h1ZHNvbg==_0', name: '/hudson' },
          { serviceEndpointId: '2_L3Byb2plY3RBL3Rlc3Q=_0', name: '/projectA/test' },
          {
            serviceEndpointId: '2_L2NhY2hlL2dsb2JhbC9pbWcvZ3MuZ2lm_0',
            name: '/cache/global/img/gs.gif',
          },
          { serviceEndpointId: '2_L21hbmFnZXIvaHRtbA==_0', name: '/manager/html' },
          { serviceEndpointId: '2_L2FkbWluLXNjcmlwdHMuYXNw_0', name: '/admin-scripts.asp' },
        ];
        break;
      case '3':
        response = [
          { serviceEndpointId: '3_Lw==_0', name: '/' },
          { serviceEndpointId: '3_L21hbmFnZXIvaHRtbA==_0', name: '/manager/html' },
          { serviceEndpointId: '3_L2h1ZHNvbg==_0', name: '/hudson' },
          { serviceEndpointId: '3_L3Byb2plY3RBL3Rlc3Q=_0', name: '/projectA/test' },
          {
            serviceEndpointId: '3_L2NhY2hlL2dsb2JhbC9pbWcvZ3MuZ2lm_0',
            name: '/cache/global/img/gs.gif',
          },
          { serviceEndpointId: '3_L2FkbWluLXNjcmlwdHMuYXNw_0', name: '/admin-scripts.asp' },
        ];
        break;
      case '4':
        response = [
          { serviceEndpointId: '4_L3Byb2plY3RCL3t2YWx1ZX0=_0', name: '/projectB/{value}' },
        ];
        break;
      default:
        response = [];
        break;
    }
    res.end(JSON.stringify(response));
  },
};
