import React, { FC } from 'react';
import { Select, Input, Pagination } from 'antd';
import { WarningFilter, scopeOptions } from './type';
import FilterBase from '../Base/filter-base';
import './header.less';
interface IWarningHeaderProps{
	scope: string;
	keyword: string;
	pageNum: number;
	total: number;
	onChange: (filter: WarningFilter) => void;
}
const WarningHeader: FC<IWarningHeaderProps> = props => {
	const { scope, keyword, pageNum, total, onChange } = props;
	const handleChange = (label: string, value: any) => {
		switch(label){
			case 'scope':
				onChange({
					scope: value,
					keyword,
  					pageNum: 1,
				});
				break;
			case 'keyword':
				onChange({
					scope,
					keyword: value,
  					pageNum: 1,
				});
				break;
			case 'pageNum':
				onChange({
					scope,
					keyword: value,
  					pageNum,
				});
				break;
			default:
				break;
		}
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
				total={total || 0}
				onChange={(page, pageSize) => handleChange('pageNum', page)}
			/>
		</div>
	);
};
  
export default WarningHeader;