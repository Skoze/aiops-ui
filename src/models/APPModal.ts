import { Model } from 'dva';
import _ from 'lodash';
import { Dispatch } from 'redux';

export interface IAPPState {
  refresh: number;
  auto: boolean;
  refreshNum: number;
}

export type TAPPDispatch = Dispatch<{
  type: 'APP/setRefreshNum' | 'APP/setAuto' | 'APP/setRefresh';
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
  },
};

export default appModel;

