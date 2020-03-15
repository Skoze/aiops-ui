import moment from 'moment';
export interface DashBoardFilter {
    type: string;
    service?: string;
    endpoint?: string;
    serviceInstance?: string;
    database?: string;
};
export interface instanceDate {
    name: string;
    id: string;
    value: number;
};
export interface ServicesType {
    name: string;
    addTimestamp: string;
    serviceId: number;
    description: string;
    nodeType: string;
};
export interface EndpointsType {
    name: string;
    serviceEndpointId: number;
    serviceId: number;
};
export interface dateValue {
    value: number;
    predict?: number;
}
export interface dateSery {
    name?: string;
    values: Array<dateValue>;
}
export interface HeapMapData {
    name?: string;
    value: Array<[number, number, number]>;
    responseTimeStep: number,
};
export interface ServiceInstancesType {
    name: string;
    instanceUuid: string;
    language: string;
    serviceId: number;
    serviceInstanceId: number;
    attributes: Array<{name: string, value: string}>
};
export interface DatabaseType {
    name: string;
    addTimestamp: string;
    databaseId: number;
    description: string;
    nodeType: string;
};
export interface SanKey {
    nodes: Array<{name: string, value: string}>;
    calls: Array<{id: string, source: string, target: string, value?: number}>;
}
export interface DataPackage {
    label: string;
    type: string; // chart, avgChart, line, info, brief
    unit: string;
    style: any;//{height, width}
    value?: any;
    info?: any;
    color?: string;
    avg?: number;
    avgLabel?: string;
}
export enum BriefInf {
    numOfService = 'numOfService',
    numOfEndpoint = 'numOfEndpoint',
    numOfDatabase = 'numOfDatabase',
    youngGCTime = 'youngGCTime',
    oldGCTime = 'oldGCTime',
}
export const BriefInfMap: {
    [key: string]: BriefInf,
} = {
    numOfService: BriefInf.numOfService,
    numOfEndpoint: BriefInf.numOfEndpoint,
    numOfDatabase: BriefInf.numOfDatabase,
    youngGCTime: BriefInf.youngGCTime,
    oldGCTime: BriefInf.oldGCTime,
};
export interface Duration {
    end: string,
    start: string,
    step: Step,
}
export enum Step {
    MINUTE = 'MINUTE',
    HOUR = 'HOUR',
    DAY = 'DAY',
    MONTH = 'MONTH',
}
export const DashBoardFilterMap: {
    [key: string]: string
} = {
    type: '仪表盘类型',
    service: '服务',
    endpoint: '端点',
    serviceInstance: '实例',
    database: '数据库',
};
export const Yseries = (num: number) => {
    const result = [];
    for (let i = 0; i < 21 ; i++) {
        result.push(`${ i * num }ms`);
    }
    return result;
}
export const formatObject: {[key: string]: string} = {
    [Step.MINUTE]: 'YYYY-MM-DD HH:mm',
    [Step.HOUR]: 'YYYY-MM-DD HH',
    [Step.DAY]: 'YYYY-MM-DD',
    [Step.MONTH]: 'YYYY-MM',
};
export const momentObject: {[key: string]: 'm' | 'h' | 'd' | 'M'} = {
    [Step.MINUTE]: 'm',
    [Step.HOUR]: 'h',
    [Step.DAY]: 'd',
    [Step.MONTH]: 'M',
}
const basicConfig = (duration: Duration) => {
    const timeSeies: Array<string> = [];
    let startDate = moment(duration.start);
    let endDate = moment(duration.end);
    let count = 0;
    let interval = 1;
    if (startDate < endDate) {
        timeSeies.push(startDate.add(1, momentObject[`${duration.step}`]).format(formatObject[`${duration.step}`]));
        count++;
    }
    while (count > 6) {
        interval++;
        count = count / 6;
    }
    return {
        //color : []设置默认值
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
                interval,
            },
            axisLine: {
                lineStyle: {
                    color: '#aaa',
                    type: 'dashed',
                    opacity: 0.5,
                }
            },
            data: timeSeies,
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.5,
                }
            }
        },
    }
};
export const translateToLineChart = (data: dateSery, duration: Duration) => {
    const oneSery = data.values.map(p => {
        return p.value;
    })
    const defaultLineChart= basicConfig(duration);
    return {
        ...defaultLineChart,
        series: [{
            type: 'line',
            name: data.name,
            data: oneSery,
            /*
            itemStyle : {
                color: (params: Object) => Color 
                obj: seriesIndex, dataIndex, data, value
            }
            */
        }],
    };
};
export const translateToStackLineChart = (globalPercentile: Array<dateSery>, duration: Duration) => {
    const nameList: Array<string> = [];
    const series = globalPercentile.map((percent: dateSery) => {
        const oneSery = percent.values.map(p => {
            return p.value;
        })
        nameList.push(percent.name || '');
        return {
            type: 'line',
            name: percent.name,
            data: oneSery,
        };
    });
    const defaultLineChart= basicConfig(duration);
    return {
        ...defaultLineChart,
        legend: {
            data: nameList,
        },
        series,
    };
};
export const translateToBarChart = (data: dateSery, duration: Duration) => {
    const oneSery = data.values.map(p => {
        return p.value;
    })
    const defaultLineChart= basicConfig(duration);
    return {
        ...defaultLineChart,
        series: [{
            type: 'bar',
            barWidth: '50%',
            name: data.name,
            data: oneSery,
        }],
    };
    
};
export const translateToLineAreaChart = (data: Array<dateSery>, duration: Duration) => {
    const nameList: Array<string> = [];
    const series = data.map((percent: dateSery) => {
        const oneSery = percent.values.map(p => {
            return p.value;
        })
        nameList.push(percent.name || '');
        return {
            type: 'line',
            name: percent.name,
            data: oneSery,
            areaStyle: {},
        };
    });
    const defaultLineChart= basicConfig(duration);
    return {
        ...defaultLineChart,
        series,
    };
};
export const translateToHeatMapChart = (heapMapdata: HeapMapData, duration: Duration) => {
    let data = heapMapdata.value.map(function (item) {
        return [item[1], item[0], item[2] || '-'];
    });
    const defaultLineChart= basicConfig(duration);
    return {
        ...defaultLineChart,
        yAxis: {
            ...defaultLineChart.yAxis,
            axisLabel: {
                interval: 4
            },
            data: Yseries(heapMapdata.responseTimeStep),
        },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: [{
            name: heapMapdata.name,
            type: 'heatmap',
            data: data,
            label: {
                show: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }],
    }
};
export const translateToSanKeyChart = (sanKeyData: SanKey) => {
    return {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: '{b}',
        },
        series: [
            {
                type: 'sankey',
                data: sanKeyData.nodes,
                links: sanKeyData.calls.map(call => {
                    return {
                        ...call,
                        value: 1,
                    }
                }),
                focusNodeAdjacency: 'allEdges',
                label: {
                    formatter: '{c}',
               },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#aaa'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.5
                }
            }
        ]
    }
};