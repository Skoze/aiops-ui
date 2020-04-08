import { IConfig } from 'umi-types';
const swagger = 'http://47.111.19.122';
const useDebugServer = swagger;
// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  hash: true,
  proxy: {
    '/*/**': {
        target: useDebugServer,
        changeOrigin: true,
        logLevel: 'debug',
        "pathRewrite": { "^/aiops" : "" }
      },
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'aiops-ui',
        dll: false,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  ignoreMomentLocale: true,
};

export default config;
