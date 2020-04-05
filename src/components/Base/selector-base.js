import { Select } from 'antd';
import { useEffect } from 'react';
export default function SelectorBase({
  defaultOption = null,
  options = [],
  label = '',
  value = '',
  onChange = () => {},
}) {
  useEffect(() => {
    if (defaultOption) {
      onChange(defaultOption.id);
    } else {
      onChange(options[0].id);
    }
  }, [defaultOption, options, onChange]);
  return (
    <div style={{ display: 'inline-block' }}>
      {label}
      <Select
        showSearch
        style={{ minWidth: '10em', maxWidth: '20em' }}
        value={value}
        optionFilterProp="children"
        onChange={onChange}
        loading={!options.length}
      >
        {defaultOption && (
          <Select.Option key={defaultOption.id}>{defaultOption.name}</Select.Option>
        )}
        {options.map(({ id, name }) => id && <Select.Option key={id}>{name}</Select.Option>)}
      </Select>
    </div>
  );
}
