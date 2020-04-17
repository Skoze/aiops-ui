import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDuration } from '../hooks/index.js';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.css';

const DurationContext = React.createContext();

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

// export default connect((state: { APP: IAPPModel['state'] }) => {
//   return {
//     refresh: state.APP.refresh,
//     duration: state.APP.duration,
//   };
// })(BasicLayout);
export default BasicLayout;
export { DurationContext };
