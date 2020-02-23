import React from 'react';
import { Layout, Icon, Tooltip } from 'antd';

interface IProps {
}

const { Header } = Layout;

class DPHeader extends React.PureComponent<IProps, any> {

  render() {
    return (
      <Header className="header">
        <div className="logo">
          <a className="title" href="/">AIOps</a>
        </div>
        <div className="info">
          <span style={{ marginRight: '10px'}}>
            <Tooltip title="用户使用手册">
                <Icon type="question-circle" style={{ color: '#ffffff' }}/>
            </Tooltip>
          </span>
          <span>
            <Icon type="user" />
          </span>
        </div>
      </Header>
    );
  }
}

export default DPHeader;