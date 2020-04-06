import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDuration } from '../hooks/index.js';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'dva';
import { IAPPModel } from '@/models/APPModal';

const BasicLayout: React.FC = props => {
  const { range, changeDuration } = useDuration();
  const { children } = props;
  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="layout">
        <Header />
        <Layout style={{ padding: '0 24px', background: '#f0f2f5' }}>
          <Layout.Content
            style={{
              padding: '0px 0px 24px 0px',
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Layout.Content>
        </Layout>
        <Footer range={range} changeDuration={changeDuration} />
      </Layout>
    </ConfigProvider>
  );
};

export default connect((state: { APP: IAPPModel['state'] }) => {
  return {
    refresh: state.APP.refresh,
    duration: state.APP.duration,
  };
})(BasicLayout);
