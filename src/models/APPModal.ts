import { Model } from 'dva';
import { Dispatch } from 'redux';

export interface IAPPState {
  refresh: number;
  auto: boolean;
  refreshNum: number;
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
  },
};

export default appModel;

