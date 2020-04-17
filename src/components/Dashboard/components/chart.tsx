import React, { FC, useEffect, useState } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
interface IChartProps {
 series: any
}
const Chart: FC<IChartProps> = props => {
	const { series } = props;
	const [option, setOption] = useState(series);
	useEffect(()=>{
		setOption({ series });
	}, [series]);
  return (
		<ReactEchartsCore
			echarts={echarts}
			option={option}
			notMerge={false}
			lazyUpdate={false}
			theme={"theme_name"}
		/>//notMerge不和就数据进行合并，lazyUpdate不进行立即更新
	);
};
export default Chart;