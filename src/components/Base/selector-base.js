import { Select } from 'antd';
import { useEffect } from 'react';
export default function SelectorBase({
  options = [],
  label = '',
  value = '',
  onChange = () => {},
}) {
  useEffect(() => {
    if (options[0]) {
      onChange(options[0].id);
    }
  }, [options, onChange]);
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
        {options.map(({ id, name }) => id && <Select.Option key={id}>{name}</Select.Option>)}
      </Select>
    </div>
  );
}
