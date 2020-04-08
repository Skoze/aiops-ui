import React, { createContext } from 'react';
import { Layout, ConfigProvider } from 'antd';
import moment from 'moment';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDuration, getDuration } from '../hooks';
import zhCN from 'antd/es/locale/zh_CN';
import { Duration } from '@/components/Dashboard/type';

const DurationContext = createContext<{range: moment.Moment[], duration: Duration}>({
  range: [moment().subtract(15, 'm'), moment()],
  duration: getDuration([moment().subtract(15, 'm'), moment()])
});

const BasicLayout: React.FC = props => {
  const { duration, range, refresh, changeDuration } = useDuration();
  const { children } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="layout">
        <Header refresh={refresh} />
        <Layout style={{ padding: '0 24px', background: '#f0f2f5' }}>
          <Layout.Content
            style={{
              padding: '0px 0px 24px 0px',
              margin: 0,
              minHeight: 280,
            }}
          >
            <DurationContext.Provider value={{ duration, range }}>
              {children}
            </DurationContext.Provider>
          </Layout.Content>
        </Layout>
        <Footer range={range} changeDuration={changeDuration} />
      </Layout>
    </ConfigProvider>
  );
};

export default BasicLayout;
export { DurationContext };
