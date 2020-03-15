import React, { FC } from 'react';
import { Menu, Dropdown } from 'antd';
import _ from 'lodash';
import { DashBoardFilterMap } from '../../type';
import FilterBase from '../../../Base/filter-base';
interface IDropDownSelectProps {
  choises: Array<any>;
  onChange: (type: string, key: string) => void;
  target: string;
  type: string;
  idName: string;
}
const DropDownSelect: FC<IDropDownSelectProps> = props => {
  const { choises, onChange, type, target, idName = 'serviceId' } = props;
  const menu = (
    <Menu onClick={({key}) => onChange(type, key)}>
      {
        choises.map(choise => (
          <Menu.Item key={String(choise[`${idName}`])}>{choise.name}</Menu.Item>
        ))
      }
    </Menu>
  );
  return (
    <div>
      <FilterBase label={`当前${DashBoardFilterMap[`${type}`]}`}>
        <Dropdown overlay={menu}>
          <a
            className="ant-dropdown-link"
            onClick={e => e.preventDefault()}
          >
            <span>
              { _.find(choises, choise => String(choise[`${idName}`]) === target)?.name}
            </span>
          </a>
      </Dropdown>
      </FilterBase>
      
    </div>
    
  )
}
export default DropDownSelect;