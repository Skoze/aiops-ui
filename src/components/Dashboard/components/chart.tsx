import React, { FC } from 'react';
import ReactEcharts from "echarts-for-react";
interface IChartProps {
 series: any
}
const Chart: FC<IChartProps> = props => {
	const { series } = props;
  return (
		<ReactEcharts
			option={series}
			notMerge={false}
			lazyUpdate={false}
			theme={"theme_name"}
			style={{ height: '100%', width: '100%' }}
		/>//notMerge不和就数据进行合并，lazyUpdate不进行立即更新
	);
};
export default Chart;