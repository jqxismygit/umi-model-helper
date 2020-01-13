import { Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
export interface RestfulApiResponse extends Promise<any> {
}
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
export declare type Effect = (action: Action, effects: EffectsCommandMap) => void;
export declare type Proxy<T> = {
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
export declare const addProxy: <T>(id: string, proxy: Proxy<T>) => void;
export default function createModel(namespace: string, api: RestfulApi, option?: Option): Model;
