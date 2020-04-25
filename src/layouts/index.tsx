import React, { createContext } from 'react';
import { Layout, ConfigProvider } from 'antd';
import moment from 'moment';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDuration, getDuration } from '../hooks';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.css';
import { Duration } from '@/components/Dashboard/type';

const DurationContext = createContext<{ range: moment.Moment[]; duration: Duration }>({
  range: [moment().subtract(15, 'm'), moment()],
  duration: getDuration([moment().subtract(15, 'm'), moment()]),
});

const BasicLayout: React.FC = props => {
  const { duration, range, refresh, changeDuration } = useDuration();
  const { children } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className={styles.layout}>
        <Header refresh={refresh} />
        <Layout.Content className={styles.content}>
          <DurationContext.Provider value={{ duration, range }}>
            {children}
          </DurationContext.Provider>
        </Layout.Content>
        <Footer range={range} changeDuration={changeDuration} />
      </Layout>
    </ConfigProvider>
  );
};

export default BasicLayout;
export { DurationContext };
