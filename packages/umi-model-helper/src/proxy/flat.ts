import { Proxy } from '../index';

const proxy: Proxy<any> = {
  normalize: (list) => {
    const byId =
      list &&
      list.reduce((prev, c) => {
        if (c && c.id) {
          prev[c.id] = c;
        }
        return prev;
      }, {});
    return {
      byId: byId || [],
      allIds: list || []
    };
  },
  transform: (byId) => Object.keys(byId || {}).reduce((prev, id) => prev.concat(byId[id]), [])
};

export default proxy;
