import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import router from 'umi/router';
import Header from '../components/Header';

const BasicLayout: React.FC = props => {

  const { children } = props;
  const paths = window.location.pathname.split('/');
  return (
    <Layout className="layout">
      <Header />
        <Layout style={{ padding: '0 24px', background: '#f0f2f5' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {paths.map((path, index) => {
              return index <= 1
                ? null
                : (
                  <Breadcrumb.Item
                    key={path}
                    onClick={e => {
                      e.stopPropagation();
                      router.push('/' + paths.slice(2, index + 1).join('/'));
                    }}
                  >
                    <span style={{ textTransform: 'capitalize', cursor: 'pointer'}}>{decodeURI(path)}</span>
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
    </Layout>
  );
};

export default BasicLayout;
