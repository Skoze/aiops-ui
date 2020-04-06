import React from 'react';
import { Layout } from 'antd';
import Header from '../components/Header';

const BasicLayout: React.FC = props => {

  const { children } = props;
  return (
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
    </Layout>
  );
};

export default BasicLayout;
