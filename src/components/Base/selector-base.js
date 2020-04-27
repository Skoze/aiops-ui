import { Select } from 'antd';
import React, { useEffect } from 'react';
export default function SelectorBase({ defaultOption = null, options = [], value = '', onChange }) {
  useEffect(() => {
    if (defaultOption) {
      onChange(defaultOption.id);
    } else {
      onChange(options[0].id);
    }
  }, [defaultOption, options, onChange]);
  return (
    <Select
      showSearch
      style={{ minWidth: '10em', maxWidth: '20em' }}
      value={value}
      optionFilterProp="children"
      onChange={onChange}
    >
      {defaultOption && <Select.Option key={defaultOption.id}>{defaultOption.name}</Select.Option>}
      {options.map(({ id, name }) => id && <Select.Option key={id}>{name}</Select.Option>)}
    </Select>
  );
}
