import React, { FC, useState } from 'react';
import { Select, Input, Pagination } from 'antd';
import { WarningFilter, scopeOptions } from './type';
import FilterBase from '../Base/filter-base';
import './header.less';
interface IWarningHeaderProps{
	filter: WarningFilter;
	onChange: (filter: WarningFilter) => void;
}
const WarningHeader: FC<IWarningHeaderProps> = props => {
	const [scope, setScope] = useState(props.filter.scope);
	const [keyword, setKeyword] = useState(props.filter.keyword);
	const [pageNum, setPageNum] = useState(props.filter.pageNum);
	const handleChange = (label: string, value: any) => {
		switch(label){
			case 'scope':
				setScope(value);
				break;
			case 'keyword':
				setKeyword(value);
				break;
			case 'pageNum':
				setPageNum(value);
				break;
			default:
				break;
		}
		props.onChange({
			scope,
  		keyword,
  		pageNum,
		});
	}
	return (
		<div className="warning-filter">
			<FilterBase label={'过滤范围'}>
				<Select
					value={scope}
					style={{ width: 120 }}
					onChange={(value: any) => handleChange('scope', value)}
				>
					{
						scopeOptions.map(item => (
							<Select.Option
								value={item.value}
								key={item.value}
							>
								{item.name}
							</Select.Option>
						))
					}
				</Select>
			</FilterBase>
			<FilterBase label={'关键字搜索'}>
				<Input
					allowClear
					value={keyword}
					onChange={value => handleChange('keyword', value)} />
			</FilterBase>
			<Pagination
        simple
        className="warning-filter-pagination"
				current={pageNum}
				defaultPageSize={20}
				total={props.filter?.total || 0}
				onChange={(page, pageSize) => handleChange('pageNum', page)}
			/>
		</div>
	);
};
  
export default WarningHeader;