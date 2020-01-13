import { Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import { default as FlatProxy } from './proxy/flat';
import { default as SingleTreeProxy } from './proxy/single-tree';
import { default as MultipleTreeProxy } from './proxy/multiple-tree';

export interface RestfulApiResponse extends Promise<any> {}

export interface RestfulApi {
  fetch?: (object: any) => RestfulApiResponse;
  fetchPart?: (object: any) => RestfulApiResponse;
  create?: (object: any) => RestfulApiResponse;
  update?: (mutable: string | any, object?: any) => RestfulApiResponse;
  remove?: (id: string) => RestfulApiResponse;
  detail?: (id: string) => RestfulApiResponse;
}

export interface Action {
  type: string;
  payload: any;
}

export interface State {
  byId: any;
  allIds: any[];
  total: number;
}

export interface EntityMap<T> {
  [key: string]: T;
}

export interface Schema<T> {
  byId: EntityMap<T>;
  allIds: T[];
}

export type Effect = (action: Action, effects: EffectsCommandMap) => void;

export type Proxy<T> = {
  normalize: (list: T[], total?: number) => Schema<T>;
  transform: (byId: EntityMap<T>) => T[];
  reduce?: (state: any, byId: EntityMap<T>, allIds: T[], total: number) => any;
};

export interface Option {
  type: string;
}

export interface Model {
  namespace: string;
  state: State;
  effects: {
    fetch: Effect;
    fetchPart: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
    detail: Effect;
  };
  reducers: {
    onFetch: Reducer<State>;
    onFetchPart: Reducer<State>;
    onCreate: Reducer<State>;
    onUpdate: Reducer<State>;
    onRemove: Reducer<State>;
  };
}

const proxies = {};

export const addProxy = <T>(id: string, proxy: Proxy<T>): void => {
  proxies[id] = proxy;
};

//加入自带的proxy
addProxy('flat', FlatProxy);
addProxy('single-tree', SingleTreeProxy);
addProxy('multiple-tree', MultipleTreeProxy);

export default function createModel(namespace: string, api: RestfulApi, option?: Option): Model {
  const { fetch, fetchPart, create, update, remove, detail } = api;
  const type = option ? option.type : 'flat';
  const proxy = proxies[type];
  if (!proxy) {
    throw new Error(`no proxy for this type [${type}]`);
  }
  const defaultReduce = (state, byId, allIds, total) => ({
    ...state,
    byId,
    allIds,
    total
  });
  const { transform, normalize } = proxy;
  const reduce = proxy.reduce || defaultReduce;
  return {
    namespace,
    state: {
      byId: {},
      allIds: [],
      total: 0
    },
    effects: {
      *fetch({ payload }, { call, put }) {
        if (fetch) {
          const response = yield call(fetch, payload);
          if (response && (response.code === 200 || response.code === 0)) {
            //TODO这个retlist是java的，以后肯定要一致
            const list = response.data.list || response.data.retlist || response.data || [];
            const total = response.data.total || list.length;
            yield put({
              type: 'onFetch',
              payload: {
                list,
                total
              }
            });
          }
        }
      },

      *fetchPart({ payload }, { call, put }) {
        if (fetchPart) {
          const response = yield call(fetchPart, payload);
          if (response && (response.code === 200 || response.code === 0)) {
            const list = response.data.list || response.data || [];
            const total = response.data.total || list.length;
            yield put({
              type: 'onFetchPart',
              payload: {
                list,
                total
              }
            });
          }
        }
      },

      *create({ payload }, { call, put }) {
        if (create) {
          const response = yield call(create, payload);
          if (response && (response.code === 200 || response.code === 0)) {
            const data = response.data;
            yield put({
              type: 'onCreate',
              payload: data
            });
          }
        }
      },

      *update({ payload }, { call, put }) {
        if (update) {
          const id = (payload && payload.id) || payload;
          const response = yield call(update, id, payload);
          if (response && (response.code === 200 || response.code === 0)) {
            const data = response.data;
            yield put({
              type: 'onUpdate',
              payload: data
            });
          }
        }
      },

      *remove({ payload }, { call, put }) {
        if (remove) {
          const id = (payload && payload.id) || payload;
          const response = yield call(remove, id);
          if (response && (response.code === 200 || response.code === 0)) {
            yield put({
              type: 'onRemove',
              payload: { id: id }
            });
          }
        }
      },

      *detail({ payload }, { call, put }) {
        if (detail) {
          // const id = (payload && payload.id) || payload;
          const response = yield call(detail, payload);
          if (response && (response.code === 200 || response.code === 0)) {
            const data = response.data;
            yield put({
              type: 'onUpdate',
              payload: data
            });
          }
        }
      }
    },
    reducers: {
      onFetch(state, { payload }) {
        const { list, total } = payload;
        const normalized = normalize(list);
        return {
          total: total,
          ...reduce(state, normalized.byId, normalized.allIds, total)
        };
      },
      onFetchPart(state, { payload }) {
        const { list, total } = payload;
        const normalized = normalize([].concat(list, state.allIds));
        return {
          total: state.total + total,
          ...reduce(state, normalized.byId, normalized.allIds, state.total + total)
        };
      },
      onCreate(state, { payload }) {
        if (payload && payload.id) {
          const byId = { ...state.byId, [payload.id]: payload };
          const allIds = transform(byId);
          return {
            total: state.total + 1,
            ...reduce(state, byId, allIds, state.total + 1)
          };
        } else {
          return state;
        }
      },

      onUpdate(state, { payload }) {
        if (payload && payload.id) {
          const byId = { ...state.byId, [payload.id]: payload };
          const allIds = transform(byId);
          return reduce(state, byId, allIds, state.total);
        } else {
          return state;
        }
      },

      onRemove(state, { payload }) {
        if (payload && payload.id) {
          const byId = { ...state.byId };
          delete byId[payload.id];
          const allIds = transform(byId);
          return {
            total: state.total - 1,
            ...reduce(state, byId, allIds, state.total - 1)
          };
        } else {
          return state;
        }
      }
    }
  };
}
