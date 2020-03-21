import React, { useReducer, useEffect } from 'react';
import { Layout, Breadcrumb, ConfigProvider } from 'antd';
import router from 'umi/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDuration } from '../hooks/index.js';
import zhCN from 'antd/es/locale/zh_CN';

const BasicLayout: React.FC = props => {
  const { duration, range, refresh, changeDuration } = useDuration();
  const { children } = props;
  const paths = window.location.pathname.split('/');
  console.log(props);
  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="layout">
        <Header />
        <Layout style={{ padding: '0 24px', background: '#f0f2f5' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {paths.map((path, index) => {
              return index <= 1 ? null : (
                <Breadcrumb.Item
                  key={path}
                  onClick={e => {
                    e.stopPropagation();
                    router.push('/' + paths.slice(2, index + 1).join('/'));
                  }}
                >
                  <span style={{ textTransform: 'capitalize', cursor: 'pointer' }}>
                    {decodeURI(path)}
                  </span>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
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

export default BasicLayout;
