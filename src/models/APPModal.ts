import { Model } from 'dva';
import { Dispatch } from 'redux';
import moment from 'moment';
import { Duration, Step } from '@/components/Dashboard/type';

export interface IAPPState {
  refresh: number;
  auto: boolean;
  refreshNum: number;
  duration: Duration;
}

export type TAPPDispatch = Dispatch<{
  type: 'APP/setRefreshNum' | 'APP/setAuto' | 'APP/setRefresh' | 'APP/AutoRefresh';
  [key: string]: any;
}>;


export interface IAPPModel extends Model {
  namespace: 'APP';
  state: IAPPState;
}

const appModel: IAPPModel = {
  namespace: 'APP',
  state: {
    refresh: 1,
    auto: false,
    refreshNum: 6,
    duration: {
      end: moment().format("YYYYMMDD"),
      start: moment().subtract(6, 'days').format("YYYYMMDD"),
      step: Step.DAY,
    },
  },
  reducers: {
    setRefreshNum(state: IAPPState, { refreshNum }: any) {
      return {
        ...state,
        refreshNum,
      };
    },
    setAuto(state: IAPPState, { auto }: any ) {
      return {
        ...state,
        auto,
      };
    },
    setRefresh(state, { refresh }: any) {
      return { ...state, refresh };
    },
    setDuration(state, { duration }: any) {
      return { ...state, duration };
    }
  },
  effects: {
    * AutoRefresh(action, { call, put, select }) {
      const delay = (ms: number) => new Promise(resolve => {
        setTimeout(resolve, ms);
      });
      let isAuto = yield select((state: {APP: IAPPState}) => state.APP.auto);
      const refreshNum = yield select((state: {APP: IAPPState}) => state.APP.refreshNum);
      while(isAuto) {
        isAuto = yield select((state: {APP: IAPPState}) => state.APP.auto);
        if (!isAuto) {
          break;
        }
        const refresh = yield select((state: {APP: IAPPState}) => state.APP.refresh);
        yield put({
          type: 'setRefresh',
          refresh: refresh + 1,
        })
        yield call(delay, refreshNum * 1000); // 延时refreshNums之后进行下一次的while循环执行
      }
    },
    *changeDuration({ duration }, { call, put, select }) {
      yield put({
        type: 'setDuration',
        duration,
      })
      const refresh = yield select((state: {APP: IAPPState}) => state.APP.refresh);
      yield put({
        type: 'setRefresh',
        refresh: refresh + 1,
      })
    }
  },
};

export default appModel;

